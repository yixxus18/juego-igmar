import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { PartidaService } from '../../services/partida.service';
import { LoginService } from '../../services/login.service';
import { User } from '../../Interfaces/user-interface';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const SLIDE_ANIMATION_DURATION = '2000ms';

export interface GameStateUpdate {
  juego: {
    id: number;
    jugador1_id: number;
    jugador2_id: number;
    turno: number;
    barcos_destruidos_jugador1: number;
    barcos_destruidos_jugador2: number;
  };
}
@Component({
  selector: 'app-juego',
  standalone: true,
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css'],
  imports: [RouterModule, CommonModule],
  animations: [
    trigger('slideInOut', [
      state('enter', style({ transform: 'translateX(-150%)', opacity: 0 })),
      state('exit', style({ transform: 'translateX(150%)', opacity: 0 })),
      transition('enter => exit', [animate(SLIDE_ANIMATION_DURATION + ' ease-out')]),
      transition('exit => enter', [animate(SLIDE_ANIMATION_DURATION + ' ease-in')]),
    ]),
    trigger('explosionAnim', [
      state('void', style({ opacity: 0, transform: 'scale(0.5)' })),
      state('*', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [animate('300ms ease-out')]),
      transition('* => void', [animate('300ms ease-in')]),
    ]),
    trigger('shipHitAnim', [
      state('hit', style({ transform: 'rotate(-5deg) scale(1.1)', filter: 'brightness(1.5)' })),
      transition('* => hit', [
        animate('150ms ease-out', style({ transform: 'rotate(5deg) scale(1.1)', filter: 'brightness(1.5)' })),
        animate('150ms ease-in')
      ]),
    ]),
  ]
})
export class JuegoComponent implements OnInit {
  private destroy$ = new Subject<void>();
  estado = 'enter';
  animacionActiva = true;
  bombasRestantes = 2;
  barcosDestruidos = 0;
  idPartida: number = 1;
  idJugador: number = 0;
  datosActualizar: any = {};
  userData: User | null = null;
  latestGameStateUpdate: GameStateUpdate | null = null;
  echo: Echo | undefined;
  explosion = false;
  isLoading: boolean = false;
  readonly animationDurationMs = 2000;
  shipState: string = 'normal';

  constructor(private elRef: ElementRef, private router: Router, private PartidaService: PartidaService, private loginService: LoginService, private cdRef: ChangeDetectorRef) {

  }

  setupWebSocket(): void {
    (window as any).Pusher = Pusher;
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: environment.pusherKey,
      cluster: environment.pusherCluster,
      encrypted: false,
      wsHost: window.location.hostname,
      wsPort: 6001,
      forceTLS: false,
      disableStatus: true
    });

    this.echo.channel('nuevojuego').listen('.App\\Events\\ActualizacionJuego', (data: any) => {
      this.latestGameStateUpdate = data as GameStateUpdate;
      console.log(this.latestGameStateUpdate);
      if (this.latestGameStateUpdate && this.latestGameStateUpdate.juego) {
        this.idPartida = this.latestGameStateUpdate.juego.id;
      
        console.log(this.idJugador);
    
        if (this.esMiTurno()) {
          this.animacionActiva = true;
          this.toggleAnimation();
        }

        if (this.latestGameStateUpdate.juego.barcos_destruidos_jugador1 === 6) {
          this.reiniciarJuego();
          alert('Se acabo el juego!');
          this.router.navigate(['index']);
        }

        if (this.latestGameStateUpdate.juego.barcos_destruidos_jugador2 === 6) {
          this.reiniciarJuego();
          alert('Se acabo el juego!');
          this.router.navigate(['index']);
        }
      }
    });
  }

  esMiTurno(): boolean {
    if (!this.latestGameStateUpdate) return false;
    return (this.idJugador === this.latestGameStateUpdate.juego.jugador1_id && this.latestGameStateUpdate.juego.turno === 1) ||
           (this.idJugador === this.latestGameStateUpdate.juego.jugador2_id && this.latestGameStateUpdate.juego.turno === 0);
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
    this.destroy$.next();
    this.destroy$.complete();
    this.closeWebSocket();
  }

  onAnimationDone(): void {
    this.explosion = false;
    this.barcoGolpeado = false;
    if (!this.latestGameStateUpdate) return;

    if (this.idJugador === this.latestGameStateUpdate.juego.jugador1_id) {
      this.datosActualizar = { turno: 0, barcos_destruidos_jugador1: this.barcosDestruidos };
    } else if (this.idJugador === this.latestGameStateUpdate.juego.jugador2_id) {
      this.datosActualizar = { turno: 1, barcos_destruidos_jugador2: this.barcosDestruidos };
    }

    this.actualizarPartida();
    this.animacionActiva = true;
  }

  toggleAnimation() {
    if (this.animacionActiva) {
      this.estado = this.estado === 'enter' ? 'exit' : 'enter';
      this.bombasRestantes = 2;
    }
  }

  barcoGolpeado = false;

  golpearBarco(event: Event) {
    if (this.barcoGolpeado) {
      return; 
    }
  
    this.barcoGolpeado = true;
    this.explosion = true;
    this.shipState = 'hit';
    setTimeout(() => this.shipState = 'normal', 300);

    event.stopPropagation();
    if (this.bombasRestantes > 0) {
      this.bombasRestantes -= 1;
      this.barcosDestruidos += 1;
      
      if (this.barcosDestruidos === 6) {
        alert('¡Ganaste!');
        this.router.navigate(['index']);
      }

      if (this.latestGameStateUpdate && (this.latestGameStateUpdate.juego.barcos_destruidos_jugador1 === 6 || this.latestGameStateUpdate.juego.barcos_destruidos_jugador2 === 6)) {
        this.router.navigate(['index']);
      }
    }
  }

  intentos() {
    if (this.bombasRestantes > 0) {
      this.bombasRestantes -= 1;
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) { 
    if (this.elRef.nativeElement.contains(event.target as Node)) {
      this.intentos();
    }
  }

  getjuego() {
    const token = localStorage.getItem('token');
    if (token) {
      this.PartidaService.getJuego(token).pipe(takeUntil(this.destroy$)).subscribe(
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
      this.PartidaService.enviarjuego(token).pipe(takeUntil(this.destroy$)).subscribe(
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
    const token = localStorage.getItem('token'); 
    if (token) {
      this.PartidaService.actualizarPartida(token, this.idPartida, this.datosActualizar).pipe(takeUntil(this.destroy$)).subscribe(
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
      this.loginService.me(token).pipe(takeUntil(this.destroy$)).subscribe(
        response => {
          this.userData = response.user; 
          if (this.userData) {
            this.idJugador = this.userData.id; 
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
    this.estado = 'enter'; 
    this.animacionActiva = true;
    this.bombasRestantes = 2;
    this.barcosDestruidos = 0;
    // JuegoComponent.tiempoAnimacion = 2; // This line is removed
  }
}