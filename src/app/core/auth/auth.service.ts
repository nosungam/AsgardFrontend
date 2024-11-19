import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { Token } from '../../../Interface/token.dto';
import { LogIn } from '../../../Interface/logIn.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlLogin = 'http://localhost:2999/';

  constructor() { }

  async login(body: LogIn): Promise<Token> {
    try {
      const response = (await axios.post(`${this.urlLogin}login`, body)).data;
      localStorage.setItem('token', JSON.stringify(response));
      return response;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async signUp(body: any): Promise<Token> {
    try {
      const response = (await axios.post(`${this.urlLogin}sign-up`, body)).data;
      localStorage.setItem('token', JSON.stringify(response));
      return response;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  logOut(): void {
    localStorage.removeItem('token')
  }
}
