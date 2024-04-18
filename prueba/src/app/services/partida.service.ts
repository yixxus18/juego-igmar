import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://192.168.1.8:8000/api/auth';
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

  getJuego(token: string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/juegos`, { headers }); // Ajusta la URL según la ruta de tu backend
  }

  enviarjuego(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/juegos`, {}, { headers });
  }

  actualizarPartida(token : string,id: number, datos: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/juegos/${id}`, datos, { headers });
  }

  obtenerResultados(token:string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/resultados`, { headers });
  }

}