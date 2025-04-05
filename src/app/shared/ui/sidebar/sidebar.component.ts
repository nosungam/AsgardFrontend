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

  previewImage: string | null = null
  editedUsername = ""
  selectedFile: File | null = null

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
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]

      // Create a preview of the selected image
      const reader = new FileReader()
      reader.onload = () => {
        this.previewImage = reader.result as string
      }
      reader.readAsDataURL(this.selectedFile)
    }
  }

  saveProfile(): void {
    if (this.editedUsername.trim() !== "") {
      this.username = this.editedUsername
    }
    if (this.previewImage) {
      this.image = this.previewImage
    }
    this.authService.updateUser(this.editedUsername, this.image)
    
    this.showProfileEditor = false;
  }
}
