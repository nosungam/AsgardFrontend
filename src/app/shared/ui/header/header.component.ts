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
  isSearching = false

  isDarkMode = false

  constructor(private notesService: NotesService, private router:Router, private authService: AuthService, public updateWorkspaceService: UpdateWorkspaceService) {}

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
      this.folders = this.updateWorkspaceService.folders;
    } catch (error) {
      // console.error('Error fetching folders:', error);
    }
  }


  openWorkspace(folderId: string): void {
    this.router.navigate(['/workspace', folderId]);
  }

  onSearch(): void {
    // Limpiar resultados si la búsqueda está vacía
    if (!this.searchTerm || this.searchTerm.trim() === "") {
      this.filteredResults = { flashcards: [], folders: [], notes: [] }
      return
    }

    this.isSearching = true

    const body: PromptDTO = {
      prompt: this.searchTerm,
      username: this.username,
    }

    console.log("Realizando búsqueda con:", body)

    this.notesService.search(body).subscribe({
      next: (results: any) => {
        this.filteredResults = {
          flashcards: results.flashcards || [],
          folders: results.folders || [],
          notes: results.notes || [],
        }
        console.log("Resultados recibidos:", this.filteredResults)
        this.isSearching = false
      },
      error: (err) => {
        console.error("Error al buscar:", err)
        this.filteredResults = { flashcards: [], folders: [], notes: [] }
        this.isSearching = false
        // Opcional: mostrar un mensaje al usuario sobre el error
      },
    })
  }

  hasAnyResults(): boolean {
    return (
      this.filteredResults.flashcards.length > 0 ||
      this.filteredResults.folders.length > 0 ||
      this.filteredResults.notes.length > 0
    );
  }

  selectSuggestion(suggestion: any): void {
    console.log("Sugerencia seleccionada:", suggestion)

    // Limpiar los resultados inmediatamente para mejorar UX
    this.filteredResults = { flashcards: [], folders: [], notes: [] }
    this.searchTerm = ""

    if (!suggestion || !suggestion.id) {
      console.error("Sugerencia inválida")
      return
    }

    // Determinar tipo de sugerencia y navegar adecuadamente
    if ("name" in suggestion) {
      // Es una carpeta o nota
      console.log("Navegando a workspace:", suggestion.id)
      this.router.navigate([`/workspace/${suggestion.id}`])
    } else if ("title" in suggestion || "question" in suggestion) {
      // Es una flashcard
      console.log("Navegando a flashcard:", suggestion.id)
      this.router.navigate([`/flashcard/${suggestion.id}`])
    } else {
      console.error("Tipo de sugerencia desconocido:", suggestion)
    }
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
