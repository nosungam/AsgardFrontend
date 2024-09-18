import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { LogIn } from '../../../Interface/logIn.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  showHide= 'show';
  typeShowHide = 'password';

  form = this.formBuilder.group({
    password: ["", [Validators.required, Validators.minLength(6)]],
    email: ["", [Validators.required, Validators.email]]
  });

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router) {
  }

  async login(){
    return new Promise((resolve, reject) => {
      const loginData: LogIn = {
        password: this.form.value.password!,
        email: this.form.value.email!
      };
      this.authService.login(loginData)
      .then(() => {
        this.router.navigate(['/home']);
        resolve(true);
      })
      .catch((error)=>{ 
        console.log(error);
        reject(error);
      })})
  }

  showHidePassword(){
    if (this.showHide === 'show'){
      this.showHide = 'hide';
      this.typeShowHide = 'text';
    } else {
      this.showHide = 'show';
      this.typeShowHide = 'password';
  }}

  authOnSubmit(){
    if (this.form.valid){
      console.warn(this.form.value);
      }
    }

    moveToSignUp(){
      this.router.navigate(['/sign-up']);
    }

}
