import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { User } from '../../Interfaces/user-interface';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { PartidaService } from '../../services/partida.service';
@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent implements OnInit {
  userData: User | null = null;
  partidas: any[] = [];
  constructor(private loginService: LoginService, private router: Router , private PartidaService: PartidaService) { }
  echo: Echo | undefined;
  ngOnInit(): void {
    this.getUserData();
    this.setupWebSocket();
    this.enviarPartida(); 
  }

  ngOnDestroy(): void {
    this.closeWebSocket();
  }

  setupWebSocket(): void {
    (window as any).Pusher = Pusher;
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: '123', 
      cluster: 'mt1',
      encrypted: false,
      wsHost: window.location.hostname,
      wsPort: 6001,
      forceTLS: false,
      disableStatus: true
    });

    this.echo.channel('nuevapartida').listen('.App\\Events\\NuevaReparacion', (e: any) => {
      console.log(e);
      if (e.partida.player2_id) {
        // Redirigir a otra página si la partida tiene dos jugadores
        this.router.navigate(['/juego']);
      }
    });

  }

  closeWebSocket(): void {
    if (this.echo) {
      this.echo.disconnect();
    }
  }

  getUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      this.loginService.me(token).subscribe(
        response => {
          this.userData = response.user; // Accede a la propiedad 'user' de la respuesta
          console.log(this.userData);
        },
        (error) => {
          console.error(error);
        }
      );
      
    }
  }

  getPartida() {
    const token = localStorage.getItem('token');
    if (token) {
      this.PartidaService.getPartidas(token).subscribe(
        response => {
          console.log(response);
          this.partidas = response;
        },
        (error) => {
          console.error(error);
        }
      );
      
    }
  }

  enviarPartida() {
    const token = localStorage.getItem('token');
    if (token) {
      // Suponiendo que player1_id es el ID del usuario actual
      this.PartidaService.createPartida(token).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  logout() {
    this.router.navigate(['/index/login']); // Asegúrate de inyectar 'Router' de '@angular/router' en tu constructor
  }


}
