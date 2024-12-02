import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../../../src/app/core/notesConnection/notes.service';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './workspace.component.html'
})
export class WorkspaceComponent implements OnInit {
  folders: any[] = [];
  flashcards: any[] = [];

  constructor(private notesService: NotesService) {}

  async ngOnInit() {
    try {
      this.folders = await this.notesService.getFolders(1);
      console.log(this.folders);

      this.notesService.getFlashcards(1).subscribe({
        next: (data) => {
          this.flashcards = data;
          console.log(data);
        },
        error: (error) => {
          console.error('Error fetching flashcards:', error);
        }
      });
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }
}
