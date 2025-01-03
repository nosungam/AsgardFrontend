import { Component, OnInit, signal } from '@angular/core';
import { TemplateComponent } from './shared/ui/template/template.component';
import { SidebarComponent } from './shared/ui/sidebar/sidebar.component';
import { HeaderComponent } from './shared/ui/header/header.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from './core/middleware/auth-guard.service';
import { AuthRedirectGuard } from './core/middleware/auth-redirect-guard.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TemplateComponent, 
    HeaderComponent, 
    SidebarComponent, 
    CommonModule,
    HttpClientModule,
  ],
  providers: [AuthGuardService, AuthRedirectGuard],
  templateUrl: './app.component.html',

})
export class AppComponent implements OnInit {
  isSidebarCollapsed = signal<boolean>(false);
  showSidebar = true;
  showHeader = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Escucha los cambios de la ruta para mostrar u ocultar el sidebar y header
    this.router.events.subscribe(() => {
      const noSidebarOrHeaderRoutes = ['/login', '/sign-up']; // Rutas sin sidebar ni header

      // Verifica si la ruta actual es una de las que no debe mostrar sidebar o header
      this.showSidebar = !noSidebarOrHeaderRoutes.includes(this.router.url);
      this.showHeader = !noSidebarOrHeaderRoutes.includes(this.router.url);
    });
  }

  // changeIsSidebarCollapsed(isSidebarCollapsed: boolean): void {
  //   this.isSidebarCollapsed.set(isSidebarCollapsed);
  // }
}
