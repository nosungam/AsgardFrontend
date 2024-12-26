import { Routes } from '@angular/router';
import { LoginComponent } from './routes/login/login.component';
import { SignUpComponent } from './routes/sign-up/sign-up.component';
import { AuthGuardService } from './core/middleware/auth-guard.service';
import { WorkspaceComponent } from './routes/workspace/workspace.component';
import { HomeComponent } from './routes/home/home.component';
import { AuthRedirectGuard } from './core/middleware/auth-redirect-guard.service';

export const routes: Routes = [
    // { path : 'template', component: TemplateComponent},
    { path : 'home', component: HomeComponent, canActivate: [AuthGuardService] },
    { path : 'login', component: LoginComponent, canActivate: [AuthRedirectGuard]  },
    { path : 'sign-up', component: SignUpComponent, canActivate: [AuthRedirectGuard] },
    { path : 'workspace/:id', component: WorkspaceComponent, canActivate: [AuthGuardService] },
    { path : '', redirectTo: '/home', pathMatch: 'full'},
    { path : '**', redirectTo: '/home'}
];
