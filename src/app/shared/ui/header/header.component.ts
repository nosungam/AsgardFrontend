import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../../core/notesConnection/notes.service';
import { PromptDTO } from '../../../../Interface/prompt.dto';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  folders: any[] = [];
  searchTerm: string = ''; 
  filteredResults: { flashcards: any[], folders: any[], notes: any[] } = { flashcards: [], folders: [], notes: [] };
  username: string = '';
  name: string = '';

  constructor(private notesService: NotesService, private router:Router, private authService: AuthService) {}

  async ngOnInit() {
    try {
      this.username = await this.authService.getUsername();
      this.notesService.getWorkspaces().subscribe(currentFolder => {
        this.folders = currentFolder;
      });
      
    } catch (error) {
      // console.error('Error fetching folders:', error);
    }
  }

  openWorkspace(folderId: string): void {
    this.router.navigate(['/workspace', folderId]);
  }

  onSearch(): void {
    if(this.searchTerm) {
      const body:PromptDTO = { prompt: this.searchTerm, username: this.username };
      this.notesService.search(body).subscribe({
        next: (results: any) => {
          this.filteredResults = {
            flashcards: results.flashcards,
            folders: results.folders,
            notes: results.notes
          };
        },
        error: err => {
          console.error('Error al buscar:', err);
          this.filteredResults = { flashcards: [], folders: [], notes: [] };
        }
      });
    } else {
      this.filteredResults = { flashcards: [], folders: [], notes: [] };
    }
  }

  selectSuggestion(suggestion: any): void {
    this.filteredResults = { flashcards: [], folders: [], notes: [] };
    if (suggestion.id) {
      if (suggestion.hasOwnProperty('name')) {
        this.router.navigate([`/workspace/${suggestion.id}`]);
      } else if (suggestion.hasOwnProperty('question')) {
        this.router.navigate([`/flashcard/${suggestion.id}`]);
      }
    }
    this.searchTerm = '';
  }

  changeTheme(): void {
    
  }
}
