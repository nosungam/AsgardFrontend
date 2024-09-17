import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { LoginComponent } from './login.component';

// Mock del servicio de autenticación
class MockAuthService {
  login(loginData: any) {
    return Promise.resolve(loginData); // Simula un observable exitoso
  }
}

// Mock del router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule], // Importamos los módulos necesarios
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: MockAuthService }, // Usamos el mock
        { provide: Router, useClass: MockRouter } // Usamos el mock
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
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

  it('should require email and password', () => {
    let email = component.form.controls['email'];
    let password = component.form.controls['password'];

    expect(email.valid).toBeFalsy();
    expect(password.valid).toBeFalsy();

    email.setValue('test@example.com');
    password.setValue('123456');

    expect(component.form.valid).toBeTruthy();
  });

  it('should call authService login on submit with valid form', () => {
    spyOn(authService, 'login').and.callThrough();

    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('123456');

    component.login();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '123456',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should log error if login fails', async () => {
    spyOn(authService, 'login').and.returnValue(Promise.reject('error'));
    spyOn(console, 'log');

    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('123456');

    await component.login();

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

  it('should navigate to sign-up page', () => {
    component.moveToSignUp();
    expect(router.navigate).toHaveBeenCalledWith(['/sign-up']);
  });

});
