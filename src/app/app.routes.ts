import { Routes } from '@angular/router';
import { LoginComponent } from './routes/login/login.component';
import { SignUpComponent } from './routes/sign-up/sign-up.component';
import { AuthGuardService } from './core/middleware/auth-guard.service';
import { WorkspaceComponent } from './routes/workspace/workspace.component';
import { HomeComponent } from './routes/home/home.component';
import { AuthRedirectGuard } from './core/middleware/auth-redirect-guard.service';
import { StudySessionComponent } from './routes/study-session/study-session.component';
import { StatsComponent } from './routes/stats/stats.component';
import { FlashcardComponent } from './routes/flashcard/flashcard.component';
import { CommunityWorkspacesComponent } from './routes/community-workspaces/community-workspaces.component';
import { RecycleBinComponent } from './routes/recycle-bin/recycle-bin.component';
import { CalendarComponent } from './routes/calendar/calendar.component';
import { RecoverPasswordComponent } from './routes/recover-password/recover-password.component';
import { ResetPasswordComponent } from './routes/reset-password/reset-password.component';

export const routes: Routes = [
    // { path : 'template', component: TemplateComponent},
    { path : 'home', component: HomeComponent, canActivate: [AuthGuardService] },
    { path : 'login', component: LoginComponent, canActivate: [AuthRedirectGuard] },
    { path : 'sign-up', component: SignUpComponent, canActivate: [AuthRedirectGuard] },
    { path : 'workspace/:id', component: WorkspaceComponent, canActivate: [AuthGuardService] },
    { path : 'flashcard/:id', component: FlashcardComponent, canActivate: [AuthGuardService] },
    { path : 'session/:id', component: StudySessionComponent, canActivate: [AuthGuardService] },
    { path : 'stats/:id', component: StatsComponent, canActivate: [AuthGuardService] },
    { path : 'community-workspaces', component: CommunityWorkspacesComponent, canActivate: [AuthGuardService] },
    { path : 'recycle-bin', component: RecycleBinComponent, canActivate: [AuthGuardService] },
    { path : 'calendar', component: CalendarComponent, canActivate: [AuthGuardService] },
    { path : 'recover-password', component: RecoverPasswordComponent, canActivate: [AuthRedirectGuard] },
    { path : 'reset-password', component: ResetPasswordComponent, canActivate: [AuthRedirectGuard] },
    { path : '', redirectTo: '/home', pathMatch: 'full'},
    { path : '**', redirectTo: '/home'}
];
