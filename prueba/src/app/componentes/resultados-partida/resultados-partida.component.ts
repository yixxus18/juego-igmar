import { Component } from '@angular/core';
import { PartidaService } from '../../services/partida.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { User } from '../../Interfaces/user-interface';
import { Token } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resultados-partida',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados-partida.component.html',
  styleUrl: './resultados-partida.component.css'
})
export class ResultadosPartidaComponent {
  resultados: any[] = [];
  userData: User | null = null;
  constructor(private partidaService: PartidaService, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
    this.partidaService.obtenerResultados(token).subscribe(data => {
      this.resultados = data;
      console.log(this.resultados);
    });

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
  index(){
    this.router.navigate(['/index']);
  }
}
