import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../Interfaces/login';
import { User } from '../Interfaces/user-interface';
import { environment } from '../../environments/environment';
interface environment {
  apiUrl: string;
}
@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private loginURL = "http://192.168.1.8:8000/api/auth/login";
  private token: string|null = null;
  private static instance: LoginService

  constructor(private http: HttpClient) {
    LoginService.instance = this;
  }

  public static getInstance(): LoginService{
    return LoginService.instance
  }
  
  login(email: string, password: string): Observable<any> {
    const url = `${environment.apiUrl}/login`;
    return this.http.post<Login>(url, { email, password });
  }

  setToken(token: string|null){
    this.token = token
  }
  getToken(): string|null{
    return this.token
  }

  // Hacer petición a api
  LogIn(user: Login): Observable<User> {
    return this.http.post<User>(this.loginURL, user)
  }

  Verificar(): Observable<any> {
    let url = `${environment.apiUrl}/me`
    return this.http.post<any>(url, null)
  }


  register(user: User): Observable<any> {
    const url = `${environment.apiUrl}/register`;
    return this.http.post<User>(url, user);
  }
  
  verificarToken(token: string): Observable<any> {
    const url = `${environment.apiUrl}/verify`;
    return this.http.post<any>(url, { token });
  }

  me(token: string): Observable<any> {
    const url = `${environment.apiUrl}/me`;
    return this.http.post<any>(url, { token });
  }
  

}
