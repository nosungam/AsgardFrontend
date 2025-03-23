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
  username: string = '';
  parent: number = 0;

  constructor(private notesService: NotesService) {}

  async ngOnInit() {
    try {
      this.username = (localStorage.getItem('email') || '').replace(/^"(.*)"$/, '$1');
      this.loadCommunityWorkspaces();
    } catch (error) {
      console.error('Error fetching community workspaces:', error);
    }
  }

  private loadCommunityWorkspaces(): void {
    this.notesService.getCommunityWorkspaces().subscribe(currentFolder => {
      
      this.folders = currentFolder;
    });
  }

  downloadFolder(folderId: number): void {
    this.notesService.getFolders(folderId).subscribe(currentFolder => {
      console.log('Folder:', currentFolder);
      this.parent = currentFolder.id || 0;
      this.notesService.cloneCommunityWorkspace(folderId, this.username, this.parent).subscribe({
        next: () => {
          console.log('Folder downloaded successfully.');
        }
      });
    });
  }
}
