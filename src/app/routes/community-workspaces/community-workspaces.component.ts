import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotesService } from '../../../../src/app/core/notesConnection/notes.service';
import { UpdateWorkspaceService } from '../../core/util/updateWorkspace.service';

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

  constructor(private notesService: NotesService, private updateWorkspace: UpdateWorkspaceService) {}

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
      this.notesService.cloneCommunityWorkspace(folderId, this.username).subscribe({
        next: () => {
          console.log('Folder downloaded successfully.');
          this.updateWorkspace.updateFolders(this.username)

        }
      });
    });
  }
}
