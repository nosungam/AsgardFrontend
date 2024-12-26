import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../../../src/app/core/notesConnection/notes.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FolderDTO } from '../../../Interface/folder.dto';
import { FlashcardDTO } from '../../../Interface/flashcard.dto';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './workspace.component.html'
})

export class WorkspaceComponent implements OnInit {
  folders: any[] = [];
  flashcards: any[] = [];
  note: string = '';
  workspace = {
    name: 'Workspace 2',
  };

  workspaceId: number | null = null;
  workspaceData: any;

  constructor(private notesService: NotesService, private route:ActivatedRoute, private router:Router) {}

  async ngOnInit() {
    try {
      this.route.paramMap.subscribe(paramMap => {
        this.workspaceId = paramMap.get("id") ? parseInt(paramMap.get("id")!, 10) : null;
        if (this.workspaceId) {
          this.loadWorkspaceData(this.workspaceId);
        }
      });
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }

  saveNote(): void {
    if (!this.workspaceId) {
      console.error('Workspace ID is null. Cannot save note.');
      return;
    }
    this.notesService.updateNote(this.note, this.workspaceId).subscribe({
      
      next: () => {
        console.log('Note updated successfully.');
        if (this.workspaceId) {
          this.loadWorkspaceData(this.workspaceId);
        }
      },
      error: err => {
        console.error('Error updating note:', err);
      }
    });
  }

  private loadWorkspaceData(workspaceId: number): void {
    this.notesService.getFolders(workspaceId).subscribe(currentFolder => {
      this.workspace.name = currentFolder.name || '';
      this.folders = currentFolder.children || [];
      this.note = currentFolder.note || '';
      this.flashcards = currentFolder.flashcard || [];
    });
  }

  onCreateFolder(event: Event): void {
    event.preventDefault();

    const newFolder: FolderDTO = {
      name: 'New Folder',
      isWorkspace: false,
      parentId: this.workspaceId
    };
    
    this.notesService.createWorkspace(newFolder).subscribe({
      next: () => {
        console.log('Folder created.');
        if (this.workspaceId) {
          this.loadWorkspaceData(this.workspaceId);
        }
      },
      error: err => {
        console.error('Error creating folder:', err);
      }
    });
  }

  onCreateFlashcard(event: Event): void {
    event.preventDefault();

    if (this.workspaceId === null) {
      console.error('Workspace ID is null. Cannot create flashcard.');
      return;
    }

    const newFlashcard: FlashcardDTO = {
      title: "New Flashcard",
      question: "Question",
      answer: "Answer",
      folderId: this.workspaceId,
      image: ""
    };
    this.notesService.createFlashcard(newFlashcard).subscribe({
      next: () => {
        console.log('Flashcard created.');
        if (this.workspaceId) {
          this.loadWorkspaceData(this.workspaceId);
        }
      },
      error: err => {
        console.error('Error creating flashcard:', err);
      }
    });
  }

  openFolder(folderId: string): void {
    this.router.navigate(['/workspace', folderId]);
  }

  startSession(){
    this.router.navigate(['/session', this.workspaceId]);
  }
}
