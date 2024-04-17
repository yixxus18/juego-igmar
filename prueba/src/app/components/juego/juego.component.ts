import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
export class JuegoComponent {
  estado = 'enter';
  animacionActiva = true;
  bombasRestantes = 2;
  barcosDestruidos = 0;
  static tiempoAnimacion: number = 6; // Inicia con 4 segundos

  constructor() {
    this.toggleAnimation();
  }

  toggleAnimation() {
    if (this.animacionActiva) {
      this.estado = this.estado === 'enter' ? 'exit' : 'enter';
      this.bombasRestantes = 2;
  
      if (this.bombasRestantes > 0) {
        JuegoComponent.tiempoAnimacion = 6 / (this.barcosDestruidos + 1);
        setTimeout(() => {
          this.toggleAnimation();
        }, JuegoComponent.tiempoAnimacion * 1000); // Reinicia la animación después de que termine
      } else {
        this.animacionActiva = false;
        alert('¡No quedan más bombas!');
      }
    }
  }

  golpearBarco(event: Event) {
    event.stopPropagation();
    if (this.bombasRestantes > 0) {
      this.bombasRestantes -= 1;
      this.barcosDestruidos += 1;
      if (this.barcosDestruidos === 6) {
        alert('¡Ganaste!');
      } else {
        alert('¡Has golpeado el barco!');
      }
    } else {
      alert('¡No te quedan más intentos!');
    }
  }

  intentos(event: Event) {
    if (this.bombasRestantes > 0) {
      this.bombasRestantes -= 1;
    } else {
      alert('¡No te quedan más intentos!');
    }
  }
}
