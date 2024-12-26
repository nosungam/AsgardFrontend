import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(): boolean {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('token')) {
            this.router.navigate(['home']);
            return false;
        }
        return true;
    }
}