import { TestBed } from '@angular/core/testing';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { AuthService } from './auth.service';
import { LogIn } from '../../../Interface/logIn.dto';
import { Token } from '../../../Interface/token.dto';

describe('AuthService', () => {
  let service: AuthService;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should login and store token in localStorage', async () => {
    const mockLoginData: LogIn = { email: 'test', password: 'password' };
    const mockToken: Token = {
        accessToken: 'dummy-token',
        refreshToken: ''
    };

    mockAxios.onPost('http://localhost:2999/login').reply(200, mockToken);

    const token = await service.login(mockLoginData);

    expect(token).toEqual(mockToken);
    expect(localStorage.getItem('token')).toEqual(JSON.stringify(mockToken));
  });

  it('should throw HttpErrorResponse on login failure', async () => {
    const mockLoginData: LogIn = { email: 'test', password: 'password' };

    mockAxios.onPost('http://localhost:2999/login').reply(500);

    try {
      await service.login(mockLoginData);
      fail('login should have thrown an error');
    } catch (error) {
      expect((error as any).status.toBe(500));
    }
  });

  it('should signUp and store token in localStorage', async () => {
    const mockSignUpData = { username: 'test', password: 'password' };
    const mockToken: Token = {
        accessToken: 'dummy-token',
        refreshToken: ''
    };

    mockAxios.onPost('http://localhost:2999/sign-up').reply(200, mockToken);

    const token = await service.signUp(mockSignUpData);

    expect(token).toEqual(mockToken);
    expect(localStorage.getItem('token')).toEqual(JSON.stringify(mockToken));
  });

  it('should log out and remove token from localStorage', () => {
    localStorage.setItem('token', 'dummy-token');
    service.logOut();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
