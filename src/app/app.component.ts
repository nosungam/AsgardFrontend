import { Component, OnInit, signal } from '@angular/core';
import { HomeComponent } from './routes/home/home.component';
import { SidebarComponent } from './shared/ui/sidebar/sidebar.component';
import { HeaderComponent } from './shared/ui/header/header.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HomeComponent, 
    HeaderComponent, 
    SidebarComponent, 
    CommonModule,
    HttpClientModule,
  ],
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
