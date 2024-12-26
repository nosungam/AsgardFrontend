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
      localStorage.setItem('email', JSON.stringify(body.email));
      return response;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async signUp(body: any): Promise<Token> {
    try {
      const response = (await axios.post(`${this.urlLogin}sign-up`, body)).data;
      localStorage.setItem('token', JSON.stringify(response));
      localStorage.setItem('email', JSON.stringify(body.email));
      return response;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  logOut(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
  }

  async getUsername(): Promise<string> {
    try {
      const email = JSON.parse(localStorage.getItem('email') || '""');
      if (!email) {
        throw new Error('No email found in localStorage');
      }
      const response = (await axios.get(`${this.urlLogin}users/${email}`)).data;
      
      return response.name;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }
}
