import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:5000'; // backend dyalek

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string, role: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password, role }).pipe(
      tap(res => {
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('access_token', res.access_token); 
      })
    );
  }
 logout(): void {
  console.log('Logging out...');
  localStorage.removeItem('access_token'); // ✅ صافي
  localStorage.removeItem('user');
  this.router.navigate(['/login']);
}

isLoggedIn(): boolean {
  return !!localStorage.getItem('access_token'); // ✅ صافي
}

  getDashboardCounts() {
  return this.http.get<any>('http://127.0.0.1:5000/dashboard-counts');
}
getToken(): string {
  return localStorage.getItem('access_token') || '';
}

}
