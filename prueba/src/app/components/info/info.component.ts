import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { User } from '../../Interfaces/user-interface';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent implements OnInit {
  userData: User | null = null;
  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.getUserData();
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

  logout() {
    // Aquí va tu lógica para manejar el cierre de sesión
    // Por ejemplo, borrar información del usuario, tokens, etc.
    
    // Redirigir al componente de login
    this.router.navigate(['/index/login']); // Asegúrate de inyectar 'Router' de '@angular/router' en tu constructor
  }
}
