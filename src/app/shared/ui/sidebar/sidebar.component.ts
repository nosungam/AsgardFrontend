import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

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
  currentWorkspace = 'Workspace 1';
  username= 'Username';
  image = "https://avatar.iran.liara.run/public/44";
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
    },
    {
      routeLink: 'settings',
      icon: 'bi bi-gear',
      label: 'Settings',
    },
  ];

  toggleCollapse(): void {
    this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsSidebarCollapsed.emit(true);
  }

  constructor(private authService: AuthService) {}

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
}
