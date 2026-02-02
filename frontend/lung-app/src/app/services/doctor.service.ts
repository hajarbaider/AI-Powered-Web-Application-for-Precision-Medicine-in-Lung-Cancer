// src/app/services/doctor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://127.0.0.1:5000/api/doctors';

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
