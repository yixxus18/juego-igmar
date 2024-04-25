import { Component, NgModule, OnInit } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css', 
})

export class IndexComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadUserRole();
  }
  
  rolUsuario: number = 0;
  loadUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.verifyToken(token).subscribe(response => {
        this.rolUsuario = response['tipo usuario'];
        
      });
    }
  }

  jugar(): void {
    this.router.navigateByUrl('/info', { replaceUrl: true });
  }

  scores(): void {
    this.router.navigate(['/results']);
  }

  logout(): void {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
