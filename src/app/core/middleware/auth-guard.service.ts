import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor( private router: Router) {}

  canActivate(
  ) {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('token')) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
