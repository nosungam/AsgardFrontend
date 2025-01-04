import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NotesService } from '../../core/notesConnection/notes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.css'
})
export class FlashcardComponent {
  flashcardId: number | null = null;
  flashcard: any = {};
  workspaceId: number | null = null;

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
}
