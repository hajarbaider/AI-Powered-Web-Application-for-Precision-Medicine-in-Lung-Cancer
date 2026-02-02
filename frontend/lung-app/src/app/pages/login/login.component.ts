import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showPassword = false;

  constructor(private http: HttpClient, private router: Router) {}

  togglePassword() {
  const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}
  login() {
    const email = (document.querySelector('input[type="email"]') as HTMLInputElement).value;
    const password = (document.getElementById("passwordInput") as HTMLInputElement).value;
    const role = (document.getElementById("roleSelect") as HTMLSelectElement).value;

    this.http.post<any>('http://127.0.0.1:5000/login', {
      email,
      password,
      role
    }).subscribe(
      (response) => {
        localStorage.setItem('user', JSON.stringify(response.user));

        // ✅ redirection selon le rôle
        if (response.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (response.role === 'medecin') {
          this.router.navigate(['/medecin-dashboard']);
        } else {
          this.router.navigate(['/patient-dashboard']);
        }
      },
      (error) => {
        alert('Email ou mot de passe incorrect');
      }
    );
  }
}