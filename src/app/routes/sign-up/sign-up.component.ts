import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  showHide= 'show';
  typeShowHide = 'password';
  checkbox:boolean = false;
  userExists: boolean = false;

  form = this.formBuilder.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]], //para validar determinadas entradas se utiliza valitadors.pattern
    confirmPassword: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]]
  },{
    validators: this.passwordMatchValidator('password','confirmPassword'),
  });

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router) {
  }

  passwordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pass = control.get(password)?.value;
      const confirmPass = control.get(confirmPassword)?.value;

      
      if (pass !== confirmPass) {
        return { passwordsDontMatch: true };
      }
      return null;
    };
  }

    async signUp(){
      return new Promise((resolve, reject) => {
        const signUpData = {
          username: this.form.value.username!,
          password: this.form.value.password!,
          email: this.form.value.email!
        };
        
        this.authService.signUp(signUpData).then(() => {
        this.router.navigate(['/home']);
        this.userExists = false;
        resolve(true);
      }).catch((error)=>{
        console.log('Error en el registro:', error);  
        this.userExists = true;
        console.log('El usuario ya existe', this.userExists);
        reject(error);
      })
    })}


    showHidePassword(){
      if (this.showHide === 'show'){
        this.showHide = 'hide';
        this.typeShowHide = 'text';
      } else {
        this.showHide = 'show';
        this.typeShowHide = 'password';
    }}

    moveToSignIn(){
      this.router.navigate(['/login']);
    }

    

}
