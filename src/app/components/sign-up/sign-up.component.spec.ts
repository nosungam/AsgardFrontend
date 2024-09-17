import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SignUpComponent } from './sign-up.component';


// Creamos un mock para el servicio de autenticación
class MockAuthService {
  signUp(signUpData: any) {
    return Promise.resolve(signUpData); // Simulamos una promesa exitosa
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent, ReactiveFormsModule], // Importamos los módulos necesarios
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should require firstName, lastName, email, password and confirmPassword', () => {
    let firstName = component.form.controls['firstName'];
    let lastName = component.form.controls['lastName'];
    let email = component.form.controls['email'];
    let password = component.form.controls['password'];
    let confirmPassword = component.form.controls['confirmPassword'];

    expect(firstName.valid).toBeFalsy();
    expect(lastName.valid).toBeFalsy();
    expect(email.valid).toBeFalsy();
    expect(password.valid).toBeFalsy();
    expect(confirmPassword.valid).toBeFalsy();

    firstName.setValue('John');
    lastName.setValue('Doe');
    email.setValue('test@example.com');
    password.setValue('123456');
    confirmPassword.setValue('123456');

    expect(component.form.valid).toBeTruthy();
  });

  it('should invalidate the form if passwords do not match', () => {
    let password = component.form.controls['password'];
    let confirmPassword = component.form.controls['confirmPassword'];

    password.setValue('123456');
    confirmPassword.setValue('654321');

    expect(component.form.valid).toBeFalsy();
    expect(component.form.errors?.['passwordsDontMatch']).toBeTruthy();
  });

  it('should call authService signUp on submit with valid form', () => {
    spyOn(authService, 'signUp').and.callThrough();

    component.form.controls['firstName'].setValue('John');
    component.form.controls['lastName'].setValue('Doe');
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('123456');
    component.form.controls['confirmPassword'].setValue('123456');

    component.signUp();

    expect(authService.signUp).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      password: '123456',
      email: 'test@example.com',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should log error if signUp fails', () => {
    spyOn(authService, 'signUp').and.returnValue(Promise.reject('error'));
    spyOn(console, 'log');

    component.form.controls['firstName'].setValue('John');
    component.form.controls['lastName'].setValue('Doe');
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('123456');
    component.form.controls['confirmPassword'].setValue('123456');

    component.signUp();

    expect(console.log).toHaveBeenCalledWith('error');
  });

  it('should toggle password visibility', () => {
    component.showHidePassword();
    expect(component.showHide).toBe('hide');
    expect(component.typeShowHide).toBe('text');

    component.showHidePassword();
    expect(component.showHide).toBe('show');
    expect(component.typeShowHide).toBe('password');
  });

  it('should navigate to sign in page', () => {
    component.moveToSignIn();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});

