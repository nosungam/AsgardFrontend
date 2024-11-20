import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../../../src/app/core/notesConnection/notes.service';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})

export class WorkspaceComponent implements OnInit {
  folders: any[] = [];
  flashcards: any[] = [];

  constructor(private notesService: NotesService) {}

  async ngOnInit() {
    this.folders = await this.notesService.getFolder(1);
    this.flashcards = await this.notesService.getFlashcards(1);
    console.log(this.folders);
    console.log(this.flashcards);
  }
}