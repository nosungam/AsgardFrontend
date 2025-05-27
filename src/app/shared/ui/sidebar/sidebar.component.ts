import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})

export class SidebarComponent implements OnInit{
  showLogoutText = false;
  showProfileEditor = false;
  currentWorkspace = 'Workspace 1';
  username= 'Username';
  image = "./avatar.png";
  items = [
    {
      routeLink: 'home',
      icon: 'bi bi-house',
      label: 'Home',
    },
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
  
  showUrlInput = false
  imageUrl = ""
  previewImage: string | null = null
  editedUsername = ""
  selectedFile: File | null = null
  userId: number = 0

  constructor(private authService: AuthService, private router: Router) {}

  logout(){
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.loadUsername();
  }

  async loadUsername(): Promise<void> {
    try {
      this.username = await this.authService.getName();
      this.userId = Number(await this.authService.getId());
      this.image = await this.authService.getImage();
    } catch (error) {
      
      // console.error('Error fetching username:', error);
      // this.username = 'Error'; // Manejo de errores
    }
  }

  toggleLogoutText(): void {
    this.showLogoutText = !this.showLogoutText;
  }

  toggleProfileEditor(): void {
    this.showProfileEditor = !this.showProfileEditor
    if (this.showProfileEditor) {
      this.editedUsername = this.username
      this.previewImage = null
    }
    this.showUrlInput = false
  }

  toggleUrlInput(): void {
    this.showUrlInput = !this.showUrlInput
    if (!this.showUrlInput) {
      this.imageUrl = ""
    }
  }

  applyImageUrl(): void {
    if (this.imageUrl && this.imageUrl.trim() !== "") {
      this.previewImage = this.imageUrl
      this.showUrlInput = false
    }
    this.showUrlInput = false
  }

  saveProfile(): void {
    if (this.editedUsername.trim() !== "") {
      this.username = this.editedUsername
    }
    if (this.previewImage) {
      this.image = this.previewImage
    }
    this.authService.updateUser(this.userId, this.editedUsername, this.image)
    
    this.showProfileEditor = false;
  }

  isUsernameValid(): boolean {
    const trimmed = this.editedUsername.trim();
    return trimmed.length > 3 && trimmed.length < 16;
  }
}
