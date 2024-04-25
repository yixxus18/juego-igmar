import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private verifyTokenUrl = `${environment.apiUrl}/verify`;

  constructor(private http: HttpClient) {}

  verifyToken(token: string): Observable<any> {
    return this.http.post<any>(this.verifyTokenUrl, { token });
  }


  verificarCodigo(verificacion: string, token: string): Observable<any> {
    const url = `${environment.apiUrl}/verificar`;
    return this.http.post<any>(url, { verificacion, token });
  }

  logout(token: string): Observable<any> {
    const url = `${environment.apiUrl}/logout`;
    return this.http.post<any>(url, { token });
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }


}
