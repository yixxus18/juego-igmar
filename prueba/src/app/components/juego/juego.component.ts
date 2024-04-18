import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { PartidaService } from '../../services/partida.service';
import { LoginService } from '../../services/login.service';
import { User } from '../../Interfaces/user-interface';

@Component({
  selector: 'app-juego',
  standalone: true,
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css'],
  imports: [RouterModule],
  animations: [
    trigger('slideInOut', [
      state('enter', style({ transform: 'translateX(-100%)', display: 'block' })),
      state('exit', style({ transform: 'translateX(100%)', display: 'none' })),
      transition('enter => exit', [
        animate(JuegoComponent.tiempoAnimacion + 's ease-out', style({ transform: 'translateX(100%)' })),
      ]),
      transition('exit => enter', [
        animate('0s')
      ])
    ])
  ]
})
export class JuegoComponent implements OnInit {
  estado = 'enter';
  animacionActiva = true;
  bombasRestantes = 2;
  barcosDestruidos = 0;
  static tiempoAnimacion: number = 2;
  idPartida: number = 1;
  idJugador: number = 0;
  datosActualizar: any = {};
  userData: User | null = null;
  e: any;
  echo: Echo | undefined;

  constructor(private elRef: ElementRef, private router: Router, private PartidaService: PartidaService, private loginService: LoginService) {
    
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

    this.echo.channel('nuevojuego').listen('.App\\Events\\ActualizacionJuego', (data: any) => {
      this.e = data;
      console.log(this.e);
      this.idPartida = this.e.juego.id;
      
      console.log(this.idJugador);
    
      if (this.esMiTurno()) {
        this.animacionActiva = true;
        this.toggleAnimation();
      }

      if (this.e.juego.barcos_destruidos_jugador1 === 6){
        this.reiniciarJuego();
        this.router.navigate(['index']);
      }

      if (this.e.juego.barcos_destruidos_jugador2 === 6){
        this.reiniciarJuego();
        this.router.navigate(['index']);
      }

    });
    
  }

  esMiTurno(): boolean {
    return (this.idJugador === this.e.juego.jugador1_id && this.e.juego.turno === 1) ||
           (this.idJugador === this.e.juego.jugador2_id && this.e.juego.turno === 0);
  }

  closeWebSocket(): void {
    if (this.echo) {
      this.echo.disconnect();
    }
  }

  ngOnInit(): void {
    this.getUserData();
    this.enviarjuego();
    this.setupWebSocket();
  }

  ngOnDestroy(): void {
    this.closeWebSocket();
  }

  toggleAnimation() {
    if (this.animacionActiva) {
      this.estado = this.estado === 'enter' ? 'exit' : 'enter';
      this.bombasRestantes = 2;
  
      const interval = setInterval(() => {
        if (this.barcosDestruidos < 6) {
          JuegoComponent.tiempoAnimacion = 2 / Math.pow((this.barcosDestruidos + 1), 2);
  
          if (this.idJugador === this.e.juego.jugador1_id && this.e.juego.turno === 1) {
            this.datosActualizar = { turno: 0 };
            this.actualizarPartida();
          } else if (this.idJugador === this.e.juego.jugador2_id && this.e.juego.turno === 0) {
            this.datosActualizar = { turno: 1 };
            this.actualizarPartida();
            
          } else {
            this.animacionActiva = false;
            clearInterval(interval); // Detener el bucle si no se cumple ninguna condición
          }
        } else {
          this.animacionActiva = false;
          clearInterval(interval); // Detener el bucle si se alcanza la condición de victoria
        }
      }, 6000);
    }
  }

  golpearBarco(event: Event) {
    event.stopPropagation();
    if (this.bombasRestantes > 0) {
      this.bombasRestantes -= 1;
      this.barcosDestruidos += 1;
      if (this.idJugador === this.e.juego.jugador1_id) {
        this.datosActualizar = { barcos_destruidos_jugador1: this.barcosDestruidos };
      this.actualizarPartida();
      }

      if (this.idJugador === this.e.juego.jugador2_id) {
        this.datosActualizar = { barcos_destruidos_jugador2: this.barcosDestruidos };
        this.actualizarPartida();
      }
      
      if (this.barcosDestruidos === 6) {
        
        if (this.idJugador === this.e.juego.jugador1_id) {
          this.datosActualizar = { barcos_destruidos_jugador1: 6 };
        this.actualizarPartida();
        }
  
        if (this.idJugador === this.e.juego.jugador2_id) {
          this.datosActualizar = { barcos_destruidos_jugador2: 6 };
          this.actualizarPartida();
        }
        alert('¡Ganaste!');
        this.reiniciarJuego();
        this.router.navigate(['index']);
      } else {
        alert('¡Has golpeado el barco!');
      }

      if (this.e.juego.barcos_destruidos_jugador1 === 6 || this.e.juego.barcos_destruidos_jugador1 === 6 ){
        alert('Se acabo el juego');
        this.reiniciarJuego();
        this.router.navigate(['index']);

      }
    } else {
      alert('¡No te quedan más intentos!');
    }
  }

  intentos() {
    
    if (this.bombasRestantes > 0) {
      this.bombasRestantes -= 1;
    } else {
      alert('¡No te quedan más intentos!');
    }
  }

   // Asegúrate de que el ElementRef esté definido

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) { // Especifica el tipo de event como MouseEvent
    if (this.elRef.nativeElement.contains(event.target as Node)) {
      this.intentos();
    }
  }

  getjuego() {
    const token = localStorage.getItem('token');
    if (token) {
      this.PartidaService.getJuego(token).subscribe(
        response => {
          console.log(response);
          
        },
        (error) => {
          console.error(error);
        }
      );
      
    }
  }

  enviarjuego() {
    const token = localStorage.getItem('token');
    if (token) {
      this.PartidaService.enviarjuego(token).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  actualizarPartida(): void {
    const token = localStorage.getItem('token'); // Obtén el token de donde corresponda
    if (token) {
      this.PartidaService.actualizarPartida(token, this.idPartida, this.datosActualizar).subscribe(
        response => {
          
        },
        error => {
          console.error('Error al actualizar la partida:', error);
        }
      );
    }
    
  }

  getUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      this.loginService.me(token).subscribe(
        response => {
          this.userData = response.user; // Accede a la propiedad 'user' de la respuesta
          if (this.userData) {
            this.idJugador = this.userData.id; // Asigna el ID del usuario al idJugador si this.userData no es nulo
            console.log(this.idJugador);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  reiniciarJuego(): void {
    this.estado = 'enter'; // O el estado inicial que desees para la animación
    this.animacionActiva = true; // Dependiendo de si quieres que la animación esté activa al inicio
    this.bombasRestantes = 2;
    this.barcosDestruidos = 0;
    JuegoComponent.tiempoAnimacion = 2; // Restablece a la velocidad inicial si es necesario
    // Cualquier otra variable que necesites reiniciar
  }

}
