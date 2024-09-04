import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { LogIn } from '../../../Interface/logIn.dto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  title = 'login';

  formulario = this.formBuilder.group({
    password: ["", [Validators.required, Validators.minLength(6)]],
    email: ["", [Validators.required, Validators.email]]
  });

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router) {
  }

  async login(){
    try {
      const loginData: LogIn = {
        password: this.formulario.value.password!,
        email: this.formulario.value.email!
      };
      this.authService.login(loginData);
      this.router.navigate(['/products']);
    } catch (error) {
      console.log(error);
    }
  }

  authOnSubmit(){
    if (this.formulario.valid){
      console.warn(this.formulario.value);
      }
    }

}
