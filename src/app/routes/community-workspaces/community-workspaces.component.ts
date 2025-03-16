import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotesService } from '../../../../src/app/core/notesConnection/notes.service';

@Component({
  selector: 'app-community-workspaces',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './community-workspaces.component.html',
  styleUrl: './community-workspaces.component.css'
})
export class CommunityWorkspacesComponent {
  folders: any[] = [];

  constructor(private notesService: NotesService) {}

  async ngOnInit() {
    try {
      this.loadCommunityWorkspaces();
    } catch (error) {
      console.error('Error fetching community workspaces:', error);
    }
  }

  private loadCommunityWorkspaces(): void {
    this.notesService.getCommunityWorkspaces().subscribe(currentFolder => {
      console.log('Community workspaces:', currentFolder);
      
      this.folders = currentFolder;
    });
  }

  setLike(folderId: number): void {
    this.notesService.suscribeToCommunityWorkspace(folderId).subscribe({
      next: () => {
        console.log('Folder liked successfully.');
      }
    });
  }
    
}
