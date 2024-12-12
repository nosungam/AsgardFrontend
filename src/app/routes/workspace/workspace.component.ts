import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../../../src/app/core/notesConnection/notes.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workspace.component.html'
})
export class WorkspaceComponent implements OnInit {
  folders: any[] = [];
  flashcards: any[] = [];

  constructor(private notesService: NotesService) {}

  async ngOnInit() {
    try {
      this.notesService.getWorkspaces().subscribe(folders => {
        this.folders = folders;
        
      });

      this.notesService.getFlashcards(1).subscribe(flashcards => {
        this.flashcards = flashcards;
        

      });
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }
}
