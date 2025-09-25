import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;

  private readonly tokenKey = 'access_token';

  register(payload: { username: string; email: string; password: string }): Observable<{ id: string; username: string; email: string }> {
    return this.http.post<{ id: string; username: string; email: string }>(`${this.apiBase}/auth/register`, payload);
  }

  login(payload: { username: string; password: string }): Observable<string> {
    const body = new HttpParams().set('username', payload.username).set('password', payload.password);
    return this.http
      .post<{ access_token: string; token_type: string }>(`${this.apiBase}/auth/login`, body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .pipe(
        map((res) => res.access_token),
        tap((token) => localStorage.setItem(this.tokenKey, token))
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
