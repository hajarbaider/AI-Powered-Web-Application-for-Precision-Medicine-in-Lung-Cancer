"""Add ResultatPredictionLungCancer table manually

Revision ID: c81d10fd3c6e
Revises: 4c585a4dbe10
Create Date: 2025-06-30 18:00:56.110530

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c81d10fd3c6e'
down_revision = '4c585a4dbe10'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'resultat_prediction_lung_cancer',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('user.id'), nullable=False),
        sa.Column('predicted_class', sa.String(100)),
        sa.Column('probabilities', sa.Text),
        sa.Column('prediction_date', sa.DateTime),
        sa.Column('image_path', sa.String(255))
    )



def downgrade():
    op.drop_table('resultat_prediction_lung_cancer')
