import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotesService } from '../../core/notesConnection/notes.service';

@Component({
  selector: 'app-recycle-bin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recycle-bin.component.html',
  styleUrl: './recycle-bin.component.css'
})
export class RecycleBinComponent {
  folders: any[] = [];
  username: string = '';

  constructor(private notesService: NotesService) {}

  async ngOnInit() {
    try {
      this.username = (localStorage.getItem('email') || '').replace(/^"(.*)"$/, '$1');
      this.loadFolders();
    } catch (error) {
      console.error('Error fetching community workspaces:', error);
    }
  }

  private loadFolders(): void {
    this.notesService.getfoldersInRecycleBin(this.username).subscribe(currentFolder => {
      console.log('Deleted folders', currentFolder);
      this.folders = currentFolder;
    });
  }

  restoreFolder(id: number): void {
    this.notesService.restoreFolder(id).subscribe({
      next: () => {
        this.loadFolders();
        console.log('Folder restored.');
      },
      error: err => {
        console.error('Error restoring folder:', err);
      }
    });
  }

  deleteFolder(id: number): void {
    console.log(`Deleting folder permanently with ID: ${id}`);
    this.notesService.deleteFolder(id).subscribe({
      next: () => {
        this.loadFolders();
        console.log('Folder permanently deleted.');
      },
      error: err => {
        console.error('Error deleting folder:', err);
      }
    });
  }
}
