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
  notes: string = '';

  constructor(private notesService: NotesService) {}

  async ngOnInit() {
    try {
      this.notesService.getFolders(5).subscribe(currentFolder => { //cambiar lo que devuelve la api
        this.folders = currentFolder.children;
        this.notes= currentFolder.note;
        this.flashcards = currentFolder.flashcard;
      });
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }
}
