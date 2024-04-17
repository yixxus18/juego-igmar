import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://127.0.0.1:8000/api/auth';
  getPartidas(token: string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/partida`, { headers }); // Ajusta la URL según la ruta de tu backend
  }

  createPartida(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/partida`, {}, { headers });
  }
}