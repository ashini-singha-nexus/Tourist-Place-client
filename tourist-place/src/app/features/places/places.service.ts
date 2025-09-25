import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;

  list(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/places/`);
  }

  create(payload: { title: string; description: string; location: string }): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/places/`, payload);
  }

  update(placeId: string, payload: Partial<{ title: string; description: string; location: string }>): Observable<any> {
    return this.http.put<any>(`${this.apiBase}/places/${placeId}`, payload);
  }

  delete(placeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/places/${placeId}`);
  }
}


