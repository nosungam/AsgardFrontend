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

  form = this.formBuilder.group({
    firstName: ["", [Validators.required]],
    lastName: ["", [Validators.required]],
    password: ["", [Validators.required, Validators.minLength(6)]], //para validar determinadas entradas se utiliza valitadors.pattern
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
          name: this.form.value.firstName!,
          surname: this.form.value.lastName!,
          password: this.form.value.password!,
          email: this.form.value.email!
        };
        
        this.authService.signUp(signUpData).then(() => {
        this.router.navigate(['/home']);
        resolve(true);
      }).catch((error)=>{
        console.log(error);
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
