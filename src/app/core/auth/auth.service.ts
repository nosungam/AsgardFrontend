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

  async updateUser(userId: number, name: string, userImg: string): Promise<any> {
    try {
      const response = (await axios.put(`${this.urlLogin}users/${userId}`, { name})).data; // falta agregar userImg al body para cambiar la imagen
      return response;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async resetPassword(token: string, body: any): Promise<any> {
  //todo work in progress
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 1000); // Simulate a 1 second delay
  });
  }

  async forgotPassword(email: string): Promise<string> { //todo llamada al back para enviar el corre
    return new Promise((resolve, reject) => {
      // Simulación de envío de correo
      setTimeout(() => {
        const success = true; // Cambia esto según el resultado del envío
        if (success) {
          resolve('Correo enviado con éxito');
        } else {
          reject('Error al enviar el correo');
        }
      }, 10000); // Simula un retraso de 1 segundo
    });
  }
}
