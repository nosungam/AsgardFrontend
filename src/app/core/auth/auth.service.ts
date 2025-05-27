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
      return Promise.reject(new HttpErrorResponse({ error }));
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
      return email;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async getName(): Promise<string> {
    try {
      const email = JSON.parse(localStorage.getItem('email') || '""');
      if (!email) {
        throw new Error('No name found in localStorage');
      }

      const response = (await axios.get(`${this.urlLogin}users/${email}`)).data;

      return response.name;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async getImage(): Promise<string> {
    try {
      const email = JSON.parse(localStorage.getItem('email') || '""');
      if (!email) {
        throw new Error('No name found in localStorage');
      }

      const response = (await axios.get(`${this.urlLogin}users/${email}`)).data;
      
      return response.img;

    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async getId(): Promise<string> {
    try {
      const email = JSON.parse(localStorage.getItem('email') || '""');
      if (!email) {
        throw new Error('No name found in localStorage');
      }

      const response = (await axios.get(`${this.urlLogin}users/${email}`)).data;

      return response.id;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async updateUser(userId: number, username: string, img: string): Promise<any> {
    try {
      const response = (await axios.put(`${this.urlLogin}users/${userId}`, { username, img})).data; // falta agregar userImg al body para cambiar la imagen
      return response;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async resetPassword(token: string, body: {password:string}): Promise<any> {
  return new Promise((resolve,reject) => {
    axios.post(`${this.urlLogin}recover-password/reset/${token}`, body)
      .then(response => {
        resolve(response.data); 
      })
      .catch(error => {
        reject(new HttpErrorResponse({ error }));
      });
  });
  }

  async forgotPassword(email: string): Promise<string> { 
    return new Promise((resolve, reject) => {
      axios.post(`${this.urlLogin}recover-password`, { email })
        .then(response => {
          resolve(response.data.message); 
        })
        .catch(error => {
          reject(new HttpErrorResponse({ error }));
        });
    });
  }
}
