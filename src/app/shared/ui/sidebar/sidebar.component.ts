import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
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
}
