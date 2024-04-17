import { Component, ElementRef, HostListener } from '@angular/core';
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
  static tiempoAnimacion: number = 2; // Inicia con 4 segundos

  constructor(private elRef: ElementRef) {
    this.toggleAnimation();
  }

  toggleAnimation() {
    if (this.animacionActiva) {
      this.estado = this.estado === 'enter' ? 'exit' : 'enter';
      this.bombasRestantes = 2;
  
      if (this.bombasRestantes > 0) {
        JuegoComponent.tiempoAnimacion = 2 / Math.pow((this.barcosDestruidos + 1), 5); // Ajusta el cálculo de la velocidad
        setTimeout(() => {
          this.toggleAnimation();
        }, 3000); // Ajusta la velocidad de animación
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
}
