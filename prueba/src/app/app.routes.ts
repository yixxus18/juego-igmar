import { Routes, CanActivate } from '@angular/router';
import { RegisterComponent } from './components/users/register/register.component';
import { LoginComponent } from './components/users/login/login.component';
import { AuthGuard } from './authguard.guard';
import { CrudComponent } from './components/users/crud/crud.component';
import { Auth2Guard } from './auth2.guard';
import { VerificacionComponent } from './components/verificacion/verificacion/verificacion.component';
import { RemoveTokenGuard } from './navigation.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full'},
    {
      path: 'index',
      loadComponent: () => import('./components/index/index.component').then(m => m.IndexComponent),
      children: [
        {
          path: 'crud',
          loadComponent: () => import('./components/users/crud/crud.component').then(m => m.CrudComponent),
          canActivate: [RemoveTokenGuard],
          
        },
        {
          path: 'categorias',
          loadComponent: () => import('./components/categorias/categorias.component').then(m => m.CategoriesComponent),
          
        },
        {
          path: 'dispositivos',
          loadComponent: () => import('./components/devices/devices.component').then(m => m.DevicesComponent),
          
        },
        {
          path: 'reparaciones',
          loadComponent: () => import('./components/reparaciones/reparaciones.component').then(m => m.ReparacionesComponent),
          
        },
        {
          path: 'accesorios',
          loadComponent: () => import('./components/accesorios/accesorios.component').then(m => m.AccesoriosComponent),
          
        },
        {
          path: 'reparaciondispositivos',
          loadComponent: () => import('./components/reparacion-dispositivo/reparacion-dispositivo.component').then(m => m.ReparacionDispositivoComponent),
          
        },
        {
          path: 'ordenventa',
          loadComponent: () => import('./components/ordenventa/ordenventa.component').then(m => m.OrdenVentaComponent),
          
        },
        {
          path: 'ordenventaa',
          loadComponent: () => import('./components/ordenventa-a/ordenventa-a.component').then(m => m.OrdenventaAccesoriosComponent),
          
        },
        {
          path: 'cita',
          loadComponent: () => import('./components/cita/cita.component').then(m => m.CitaComponent),
          
        },
        {
          path: 'ingreso',
          loadComponent: () => import('./components/ingresoreparacion/ingresoreparacion.component').then(m => m.IngresoReparacionComponent),
         
        },
        {
          path: 'reporte',
          loadComponent: () => import('./components/reporte/reporte.component').then(m => m.ReportesComponent),
          
        },
        {
          path: 'logs',
          loadComponent: () => import('./components/log/log.component').then(m => m.LogComponent),
          
        },
        { path: 'register', 
        loadComponent:()=>import('./components/users/register/register.component').then(m=>m.RegisterComponent)
        ,canActivate: [RemoveTokenGuard],
        },
          
        { path: 'login', 
        loadComponent:()=>import('./components/users/login/login.component').then(m=>m.LoginComponent)
        ,canActivate: [RemoveTokenGuard],
        },
        { path: 'verificacion', 
        loadComponent:()=>import('./components/verificacion/verificacion/verificacion.component').then(m=>m.VerificacionComponent)
        
        },

        { path: 'info', 
        loadComponent:()=>import('./components/info/info.component').then(m=>m.InfoComponent)
        , canActivate: [Auth2Guard],
        },

      ]
    }    
  ];