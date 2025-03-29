import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../../core/notesConnection/notes.service';
import { PromptDTO } from '../../../../Interface/prompt.dto';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { UpdateWorkspaceService } from '../../../core/util/updateWorkspace.service';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  folders: any[] = [];
  searchTerm: string = ''; 
  filteredResults: { flashcards: any[], folders: any[], notes: any[] } = { flashcards: [], folders: [], notes: [] };
  username: string = '';
  name: string = '';

  isDarkMode = false

  constructor(
    private notesService: NotesService, 
    private router:Router, 
    private authService: AuthService,
    public updateWorkspaceService: UpdateWorkspaceService
  ) {}

  async ngOnInit() {
    try {
      const savedTheme = localStorage.getItem("theme")
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        this.setDarkMode(true)
      } else {
        // Check if dark mode is already enabled in the DOM
        this.isDarkMode = document.documentElement.classList.contains("dark")
      }

      this.username = await this.authService.getUsername();
      this.notesService.getWorkspaces(this.username).subscribe(currentFolder => {
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

  private setDarkMode(isDark: boolean): void {
    this.isDarkMode = isDark

    // Save preference to localStorage
    localStorage.setItem("theme", isDark ? "dark" : "light")

    // Apply or remove dark class from document
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  changeTheme(): void {
    this.setDarkMode(!this.isDarkMode)
  }

  home(): void {
    this.router.navigate(['/home']);
  }
}
