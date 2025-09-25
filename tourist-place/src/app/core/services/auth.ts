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
  private readonly usernameKey = 'username';
  private readonly userIdKey = 'user_id';

  register(payload: { username: string; email: string; password: string }): Observable<{ id: string; username: string; email: string }> {
    return this.http.post<{ id: string; username: string; email: string }>(`${this.apiBase}/auth/register`, payload);
  }

  login(payload: { username: string; password: string }): Observable<{ access_token: string; user_id: string }> {
    const body = new HttpParams().set('username', payload.username).set('password', payload.password);
    return this.http
      .post<{ access_token: string; token_type: string; user_id: string }>(`${this.apiBase}/auth/login`, body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .pipe(
        map((res) => ({ access_token: res.access_token, user_id: res.user_id })),
        tap((result) => {
          localStorage.setItem(this.tokenKey, result.access_token);
          localStorage.setItem(this.usernameKey, payload.username);
          localStorage.setItem(this.userIdKey, result.user_id);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.userIdKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }
}
