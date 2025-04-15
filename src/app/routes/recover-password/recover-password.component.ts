import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';


@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {
  recoveryForm: FormGroup;
  isSubmitted = false;
  emailSent = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.recoveryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get formControls() {
    return this.recoveryForm.controls;
  }

  onSubmit() {
    if (this.recoveryForm.invalid || this.isSubmitted) {
      return;
    }

    this.isSubmitted = true;
    
    // Aquí iría la lógica para enviar el correo de recuperación
    console.log('Enviando correo a:', this.recoveryForm.value.email);
    
    this.authService.forgotPassword(this.recoveryForm.value.email).then((response) => {
      console.log(response);
      this.emailSent = true;
    }).catch((error) => {
      console.error('Error al enviar el correo:', error);
    });
  }

  backToLogin() {
    // Método para volver a la pantalla de login
    this.router.navigate(['/login']);
  }

  moveToSignUp() {
    // Método para ir a la pantalla de registro
    this.router.navigate(['/sign-up']);
  }

}
