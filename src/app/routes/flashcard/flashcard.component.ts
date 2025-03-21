import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NotesService } from '../../core/notesConnection/notes.service';
import { Router } from '@angular/router';
import { EditorConfig, NgxSimpleTextEditorModule, ST_BUTTONS } from 'ngx-simple-text-editor';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxSimpleTextEditorModule],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FlashcardComponent {
  flashcardId: number | null = null;
  flashcard: any = {};
  workspaceId: number | null = null;
  config1: EditorConfig = {
      placeholder: 'Enter Question',
      buttons: ST_BUTTONS,
  };
  config2: EditorConfig = {
      placeholder: 'Enter Answer',
      buttons: ST_BUTTONS,
  };

  constructor(private notesService: NotesService, private route:ActivatedRoute, private router:Router) {}

  async ngOnInit() {
    try {
      this.route.paramMap.subscribe(paramMap => {
        this.workspaceId = localStorage.getItem('workspaceId') ? parseInt(localStorage.getItem('workspaceId')!, 10) : null;
        
        this.flashcardId = paramMap.get("id") ? parseInt(paramMap.get("id")!, 10) : null;
        if (this.flashcardId) {
          this.loadFlashcardData(this.flashcardId);
        }
      });
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }

  loadFlashcardData(flashcardId: number): void {
    this.notesService.getFlashcard(flashcardId).subscribe(currentFolder => {
      this.flashcard = currentFolder;
    });
  }

  saveFlashcard(): void {
    this.notesService.updateFlashcard(this.flashcard).subscribe({
      next: () => {
        console.log('Flashcard updated successfully.');
        if (this.flashcardId) {
          this.loadFlashcardData(this.flashcardId);
          console.log(this.flashcard);
          
        }
      },
      error: err => {
        console.error('Error updating flashcard:', err);
      }
    });
  }
  close(): void {
    this.router.navigate(['/workspace', this.workspaceId]);
  }
}
