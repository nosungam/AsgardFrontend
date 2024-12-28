import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../../core/notesConnection/notes.service';
import { PromptDTO } from '../../../../Interface/prompt.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchTerm: string = ''; 
  filteredResults: { flashcards: any[], folders: any[] } = { flashcards: [], folders: [] };

  constructor(private notesService: NotesService, private router:Router) {}

  onSearch(): void {
    if(this.searchTerm) {
      const prompt:PromptDTO = { prompt: this.searchTerm };
      this.notesService.search(prompt).subscribe({
        next: (results: any) => {
          this.filteredResults = {
            flashcards: results.flashcards,
            folders: results.folders
          };
        },
        error: err => {
          console.error('Error al buscar:', err);
          this.filteredResults = { flashcards: [], folders: [] };
        }
      });
    } else {
      this.filteredResults = { flashcards: [], folders: [] };
    }
  }

  selectSuggestion(suggestion: any): void {
    this.filteredResults = { flashcards: [], folders: [] };
    if (suggestion.id) {
      if (suggestion.hasOwnProperty('name')) {
        this.router.navigate([`/workspace/${suggestion.id}`]);
      } else if (suggestion.hasOwnProperty('question')) {
        this.router.navigate([`/flashcard/${suggestion.id}`]);
      }
    }
    this.searchTerm = '';
  }
}
