import { Component, HostListener, OnInit, signal } from '@angular/core';
import { HomeComponent } from './routes/home/home.component';
import { SidebarComponent } from './shared/ui/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, SidebarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent{
  isSidebarCollapsed = signal<boolean>(false);
  

  changeIsSidebarCollapsed(isSidebarCollapsed: boolean): void {
    this.isSidebarCollapsed.set(isSidebarCollapsed);
  }
}