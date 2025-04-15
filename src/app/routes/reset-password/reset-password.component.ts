import { Component, OnInit,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  resetForm = this.formBuilder.group({
    password: ["", [Validators.required, Validators.minLength(6)]],
    confirmPassword: ["", [Validators.required]]
  }, {
    validators: this.passwordMatchValidator('password','confirmPassword'),
  });

  token: string = '';

  showHide= 'show';
  placeholder = '********';
  typeShowHide = 'password';

  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')!;
    }

  onSubmit() {
    this.authService.resetPassword(this.token, this.resetForm.value) //todo cambiar funcion
    .then((response) => {
      console.log(response);
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error(error);
    });
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

    showHidePassword(){
      if (this.showHide === 'show'){
        this.showHide = 'hide';
        this.typeShowHide = 'text';
        this.placeholder = 'Password';
      } else {
        this.showHide = 'show';
        this.typeShowHide = 'password';
        this.placeholder = '********';
    }}

    moveToLogin() {
      this.router.navigate(['/login']);
    }
}
