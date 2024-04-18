import { Routes, CanActivate } from '@angular/router';
import { RegisterComponent } from './components/users/register/register.component';
import { LoginComponent } from './components/users/login/login.component';
import { AuthGuard } from './authguard.guard';
import { CrudComponent } from './components/users/crud/crud.component';
import { Auth2Guard } from './auth2.guard';
import { VerificacionComponent } from './components/verificacion/verificacion/verificacion.component';
import { RemoveTokenGuard } from './navigation.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full'},
  { path: 'login', loadComponent:()=>import('./components/users/login/login.component').then(m=>m.LoginComponent),canActivate: [RemoveTokenGuard]},
  { path: 'register', loadComponent:()=>import('./components/users/register/register.component').then(m=>m.RegisterComponent),canActivate: [RemoveTokenGuard]},
  { path: 'verificacion', loadComponent:()=>import('./components/verificacion/verificacion/verificacion.component').then(m=>m.VerificacionComponent)},
  { path: 'index', loadComponent:()=>import('./components/index/index.component').then(m=>m.IndexComponent)},
  { path: 'results', loadComponent:()=>import('./componentes/resultados-partida/resultados-partida.component').then(m=>m.ResultadosPartidaComponent)},
  { path: 'info', loadComponent:()=>import('./components/info/info.component').then(m=>m.InfoComponent)},
  {
    path: 'juego',
    loadComponent: () => import('./components/juego/juego.component').then(m => m.JuegoComponent),
    children: [
      {
        path: '', // ruta vacía para 'juego'
        loadComponent: () => import('./components/barco/barco.component').then(m => m.BarcoComponent),
      }
    ]
  },
  {
    path: 'barco', // ruta vacía para 'juego'
    loadComponent: () => import('./components/barco/barco.component').then(m => m.BarcoComponent),
  }
  

  ];