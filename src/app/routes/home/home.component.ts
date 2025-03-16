import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NotesService } from '../../core/notesConnection/notes.service';
import { AuthService } from '../../core/auth/auth.service';
import { FolderDTO } from '../../../Interface/folder.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  folders: any[] = [];
  username = 'Username';
  name = 'Name';

  constructor(private notesService: NotesService, private authService: AuthService, private router:Router) { }

  async ngOnInit() {
    try {
      this.username = await this.authService.getUsername();
      this.name = await this.authService.getName();
      this.notesService.getWorkspaces().subscribe(currentFolder => {
        this.folders = currentFolder;
      });
      
    } catch (error) {
      // console.error('Error fetching folders:', error);
    }
  }

  onCreateWorkspace(event: Event): void {
    event.preventDefault(); // Prevenir comportamiento predeterminado del enlace

    const newFolder: FolderDTO = {
      name: 'New Workspace',
      isWorkspace: true,
      parentId: null,
      user: this.username
    }; // Ajusta según los campos del DTO
    this.notesService.createWorkspace(newFolder).subscribe({
      next: () => {
        console.log('Workspace creado exitosamente');
        // Opcionalmente, puedes volver a cargar las carpetas o añadir el nuevo folder a la lista local
        this.notesService.getWorkspaces().subscribe(currentFolder => {
          this.folders = currentFolder;
        });
        window.location.reload();
      },
      error: err => {
        console.error('Error creando workspace:', err);
      }
    });
  }

  openWorkspace(folderId: string): void {
    this.router.navigate(['/workspace', folderId]);
  }
}