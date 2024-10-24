import { Routes } from '@angular/router';
import { LoginComponent } from './routes/login/login.component';
import { SignUpComponent } from './routes/sign-up/sign-up.component';
import { HomeComponent } from './routes/home/home.component';
import { AuthGuardService } from './core/middleware/auth-guard.service';
import { WorkspaceComponent } from './routes/workspace/workspace.component';

export const routes: Routes = [
    { path : 'login', component: LoginComponent },
    { path : 'sign-up', component: SignUpComponent },
    { path : 'home',component: HomeComponent},//, canActivate: [AuthGuardService] },
    { path : '', component: HomeComponent},
    { path : 'workspace', component: WorkspaceComponent},
    //{ path : 'products', component: ProductsComponent, canActivate: [AuthGuardService] },
    //{ path : '', redirectTo: '/login', pathMatch: 'full' }
];
