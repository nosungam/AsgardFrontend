import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './components/middleware/auth-guard.service';

export const routes: Routes = [
    { path : 'login', component: LoginComponent },
    { path : 'sign-up', component: SignUpComponent },
    { path : 'home',component: HomeComponent, canActivate: [AuthGuardService] },
    //{ path : 'products', component: ProductsComponent, canActivate: [AuthGuardService] },
    //{ path : '', redirectTo: '/login', pathMatch: 'full' }
];
