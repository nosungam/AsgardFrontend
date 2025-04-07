import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../core/notesConnection/notes.service';
import { AuthService } from '../../core/auth/auth.service';
import { FolderDTO } from '../../../Interface/folder.dto';
import { Router } from '@angular/router';
import { UpdateWorkspaceService } from '../../core/util/updateWorkspace.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  folders: any[] = [];
  username = 'Username';
  name = 'Name';
  creatingWorkspace = false;

  newWorkspace: FolderDTO = {
    name: '',
    isWorkspace: true,
    parentId: null,
    username: ''
  };

  constructor(
    private notesService: NotesService,
    private authService: AuthService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private updateWorkspaceService: UpdateWorkspaceService
  ) { }

  async ngOnInit() {
    try {
      this.username = await this.authService.getUsername();
      this.name = await this.authService.getName();
      this.notesService.getWorkspaces(this.username).subscribe(currentFolder => {
        this.folders = currentFolder;
      });
      this.changeDetector.markForCheck();

    } catch (error) {
      // console.error('Error fetching folders:', error);
    }
  }

  onCreateWorkspace(): void {
    this.creatingWorkspace=true;
  }

  cancelEditWorkspace(): void {
    this.creatingWorkspace=false;
  }

  saveWorkspace(): void {
    this.newWorkspace.username = this.username;
    this.newWorkspace.isWorkspace = true;

    console.log('Creating workspace:', this.newWorkspace);
    
    this.notesService.createWorkspace(this.newWorkspace).subscribe({
      next: () => {
        console.log('Workspace creado exitosamente');
        // Opcionalmente, puedes volver a cargar las carpetas o añadir el nuevo folder a la lista local
        this.notesService.getWorkspaces(this.username).subscribe(currentFolder => {
          this.folders = currentFolder;
        });
        this.updateWorkspaceService.updateFolders(this.username);
        this.newWorkspace = {
          name: '',
          isWorkspace: true,
          parentId: null,
          username: ''
        };
        this.creatingWorkspace=false;
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