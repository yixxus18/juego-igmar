import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('formEntry', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ]),
    trigger('loadingButton', [
      state('idle', style({ opacity: 1 })),
      state('loading', style({ opacity: 0.8 })),
      transition('idle <=> loading', [animate('200ms ease-in-out')])
    ])
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  loginMessage: string = '';
  registerMessage: string = '';
  isLoading: boolean = false;
  isLoginSuccessful: boolean | null = null;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private loginService: LoginService, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.currentMessage.pipe(takeUntil(this.destroy$)).subscribe(message => {
      this.registerMessage = message;
      if (message) {
        setTimeout(() => {
          this.registerMessage = '';
        }, 5000);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login() {
    this.loginMessage = '';
    this.isLoginSuccessful = null;

    if (this.loginForm.invalid) {
      // Optionally, mark fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
  
    if (email && password) {
      this.loginService.login(email, password).pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
          console.log(data);
          this.loginMessage = data.message || 'Inicio de sesión exitoso.'; // Use message from data if available
          this.isLoginSuccessful = true;
          this.isLoading = false;
          localStorage.setItem('token', data.access_token);
          console.log(data.access_token);
          console.log(localStorage.getItem('token'));
          this.router.navigateByUrl('verificacion', { replaceUrl: true });
        },
        error: error => {
          console.log(error.error.msg);
          this.loginMessage = error.error.msg || 'Error al iniciar sesión.';
          this.isLoginSuccessful = false;
          this.isLoading = false;
          console.log(error);
        }
      });
    } else {
      // This case should ideally not be reached if form validation is correct
      this.loginMessage = 'Email y contraseña son requeridos.';
      this.isLoading = false;
    }
  }
}
