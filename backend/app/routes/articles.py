from flask import Blueprint, jsonify
import json
import requests
import logging
import time
from bs4 import BeautifulSoup
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
from concurrent.futures import ThreadPoolExecutor
import threading
from rouge_score import rouge_scorer

# --- Blueprint ---
articles_bp = Blueprint('articles', __name__)

# --- Logging ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# --- NLP Models ---
ner_model = pipeline("ner", model="d4data/biomedical-ner-all", aggregation_strategy="simple")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
tokenizer = AutoTokenizer.from_pretrained("microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract")
model = AutoModelForSequenceClassification.from_pretrained(
    "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract",
    num_labels=3
)
labels = ["Biomarker", "Treatment", "Clinical Trial"]

# --- Functions ---
def extract_aspects_sections(text):
    aspects = {
        "Clinical": [],
        "Methodology": [],
        "Results": [],
        "Risks/Side Effects": []
    }

    sentences = text.split('. ')
    for sent in sentences:
        s = sent.lower()

        if any(k in s for k in ['patient', 'population', 'clinical study', 'cohort', 'clinical trial', 'therapy', 'diagnosis']):
            aspects["Clinical"].append(sent)

        if any(k in s for k in ['method', 'methodology', 'design', 'protocol', 'procedure', 'materials and methods', 'in this work', 'in this study']):
            aspects["Methodology"].append(sent)

        if any(k in s for k in ['result', 'results', 'finding', 'findings', 'outcome', 'analysis', 'data shows', 'we observed', 'we found']):
            aspects["Results"].append(sent)

        if any(k in s for k in ['side effect', 'adverse effect', 'toxicity', 'risk', 'safety', 'complication', 'tolerability']):
            aspects["Risks/Side Effects"].append(sent)

    for key in aspects:
        if not aspects[key]:
            aspects[key] = "Not mentioned in the abstract."
        else:
            aspects[key] = '. '.join(aspects[key]).strip()

    return aspects

def summarize_aspects(text):
    aspects = extract_aspects_sections(text)
    summary = {}
    for aspect, content in aspects.items():
        if content and len(content.split()) > 30:
            try:
                s = summarizer(content, max_length=100, min_length=30, do_sample=False)[0]['summary_text']
                summary[aspect] = s
            except Exception as e:
                logging.warning(f"Erreur résumé pour {aspect} : {e}")
                summary[aspect] = content[:200] + "..."
        else:
            summary[aspect] = content
    return summary

def compute_rouge(reference_summary, generated_summary):
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
    scores = scorer.score(reference_summary, generated_summary)
    return {
        "rouge-1": scores['rouge1'].fmeasure,
        "rouge-2": scores['rouge2'].fmeasure,
        "rouge-L": scores['rougeL'].fmeasure
    }

def extract_with_model(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    label_index = torch.argmax(outputs.logits, dim=1).item()
    return labels[label_index]

def get_article_text(url):
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        sections = soup.select('div.abstract-content')
        abstract = "\n".join(s.get_text().strip() for s in sections)
        return abstract if abstract else None
    except Exception as e:
        logging.warning(f"Erreur récupération texte article: {e}")
        return None

def get_pubmed_articles():
    try:
        search_url = "https://pubmed.ncbi.nlm.nih.gov/?term=lung+cancer+biomarkers+therapies"
        response = requests.get(search_url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        articles = soup.select('a.docsum-title')
        return [(a.get_text().strip(), "https://pubmed.ncbi.nlm.nih.gov" + a['href']) for a in articles[:5]]
    except Exception as e:
        logging.warning(f"Erreur récupération articles PubMed: {e}")
        return []

def highlight_entities(text):
    entities = ner_model(text)
    entities = sorted(entities, key=lambda x: x['start'], reverse=True)
    for ent in entities:
        label = ent['entity_group']
        word = text[ent['start']:ent['end']]
        text = text[:ent['start']] + f"<mark class='tag {label.lower()}' title='{label}'>{word}</mark>" + text[ent['end']:]
    return text
def process_article(article):
    title, url = article
    logging.info(f"🔍 Article: {title}")
    full_text = get_article_text(url)
    if not full_text:
        logging.info("⛔ Abstract indisponible.")
        return None

    # --- Direct summary without aspect splitting ---
    try:
        generated_summary = summarizer(full_text, max_length=150, min_length=60, do_sample=False)[0]['summary_text']
    except Exception as e:
        logging.warning(f"Erreur résumé général : {e}")
        generated_summary = full_text[:300] + "..."

    # --- Compute ROUGE ---
    rouge_scores = compute_rouge(full_text[:512], generated_summary)

    # --- Category prediction ---
    category = extract_with_model(full_text)

    # --- Entity Highlighting ---
    highlighted_summary = highlight_entities(generated_summary)

    return {
        "title": title,
        "url": url,
        "category": category,
        "summary": generated_summary,  # no more dict per aspect
        "highlighted_summary": highlighted_summary,
        "rouge_scores": rouge_scores
    }


def fetch_and_process_articles():
    articles = get_pubmed_articles()
    with ThreadPoolExecutor(max_workers=4) as executor:
        results = list(filter(None, executor.map(process_article, articles)))
    with open("pubmed_results.json", "w", encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=4)
    logging.info("✅ Données sauvegardées dans pubmed_results.json")

def auto_update():
    while True:
        logging.info("🔄 AUTO-UPDATE en cours...")
        fetch_and_process_articles()
        logging.info("✅ AUTO-UPDATE terminé.")
        time.sleep(3 * 24 * 60 * 60)

# --- Auto update thread ---
threading.Thread(target=auto_update, daemon=True).start()

# --- API Route ---
@articles_bp.route('/api/articles', methods=['GET'])
def api_articles():
    try:
        with open('pubmed_results.json', 'r', encoding='utf-8') as f:
            results = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        results = []
    return jsonify(results)
