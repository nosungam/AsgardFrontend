import { Component, OnInit, signal } from '@angular/core';
import { HomeComponent } from './routes/home/home.component';
import { SidebarComponent } from './shared/ui/sidebar/sidebar.component';
import { HeaderComponent } from './shared/ui/header/header.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, HeaderComponent, SidebarComponent, CommonModule],
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit{
  isSidebarCollapsed = signal<boolean>(false);
  showSidebar = true;
  showHeader = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Escucha los cambios de la ruta para mostrar u ocultar el sidebar
    this.router.events.subscribe(() => {
      // Verificar las rutas que no deben mostrar el sidebar
      this.showSidebar = this.router.url !== '/login';
      this.showHeader = this.router.url !== '/login';
    });
  }

  changeIsSidebarCollapsed(isSidebarCollapsed: boolean): void {
    this.isSidebarCollapsed.set(isSidebarCollapsed);
  }
}