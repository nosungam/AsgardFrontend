import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})

export class SidebarComponent implements OnInit{
  isSidebarCollapsed = input.required<boolean>();
  changeIsSidebarCollapsed = output<boolean>();
  showLogoutText = false;
  currentWorkspace = 'Workspace 1';
  username= 'Username';
  image = "./avatar.png";
  items = [
    {
      routeLink: 'calendar',
      icon: 'bi bi-calendar-event',
      label: 'Calendar',
    },
    {
      routeLink: 'community-workspaces',
      icon: 'bi bi-people',
      label: 'Community Workspaces',
    },
    {
      routeLink: 'recycle-bin',
      icon: 'bi bi-trash',
      label: 'Recycle Bin',
    }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  logout(){
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  toggleCollapse(): void {
    this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsSidebarCollapsed.emit(true);
  }

  ngOnInit(): void {
    this.loadUsername();
  }

  async loadUsername(): Promise<void> {
    try {
      this.username = await this.authService.getUsername();
      
      
    } catch (error) {
      
      // console.error('Error fetching username:', error);
      // this.username = 'Error'; // Manejo de errores
    }
  }

  toggleLogoutText(): void {
    this.showLogoutText = !this.showLogoutText;
  }
}
