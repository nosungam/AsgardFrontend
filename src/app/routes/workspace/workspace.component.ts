import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../../../src/app/core/notesConnection/notes.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FolderDTO } from '../../../Interface/folder.dto';
import { FlashcardDTO } from '../../../Interface/flashcard.dto';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditorConfig, NgxSimpleTextEditorModule, ST_BUTTONS } from 'ngx-simple-text-editor';
import { UpdateWorkspaceService } from '../../core/util/updateWorkspace.service';
import { Subject } from "rxjs"
import { debounceTime } from "rxjs/operators"

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxSimpleTextEditorModule],
  templateUrl: './workspace.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class WorkspaceComponent implements OnInit, OnDestroy {
  private noteSubject = new Subject<string>()
  private subscription: any
  folders: any[] = [];
  flashcards: any[] = [];
  note: string = '';
  workspace = {
    name: 'Workspace',
    img: '',
    description: ''
  };
  workspaceId: number = -1;
  workspaceData: any;
  config: EditorConfig = {
    placeholder: 'Type something...',
    buttons: ST_BUTTONS,
  };
  username: string = '';
  uploading: boolean = false;
  showFlashcardEditor = false
  editingFlashcard: FlashcardDTO = {
    title: "",
    question: "",
    answer: "",
    folderId: -1
  }
  showDeleteConfirmation = false
  visibleFolders=true

  constructor(
    private notesService: NotesService, 
    private route:ActivatedRoute, 
    private router:Router,
    private changeDetector: ChangeDetectorRef,
    private updateWorkspace: UpdateWorkspaceService
  ) {}

  async ngOnInit() {
    try {
      this.route.paramMap.subscribe(paramMap => {
        this.username = localStorage.getItem('email') || '';
        localStorage.removeItem('workspaceId');
        this.workspaceId = paramMap.get("id") ? parseInt(paramMap.get("id")!, 10) : -1;
        if (this.workspaceId) {
          this.loadWorkspaceData(this.workspaceId);
        }
        this.changeDetector.markForCheck();

        this.subscription = this.noteSubject
        .pipe(
          debounceTime(500), // Espera 500ms después de la última actualización
        )
        .subscribe((note) => {
          this.saveNote()
        })
      });
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }

  saveNote(): void {
    if (!this.workspaceId) {
      console.error('Workspace ID is null. Cannot save note.');
      return;
    }
    this.notesService.updateNote(this.note, this.workspaceId).subscribe({
      
      next: () => {
        console.log('Note updated successfully.');
        if (this.workspaceId) {
          this.loadWorkspaceData(this.workspaceId);
        }
      },
      error: err => {
        console.error('Error updating note:', err);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  onNoteChange() {
    this.noteSubject.next(this.note)
  }

  private loadWorkspaceData(workspaceId: number): void {
    this.notesService.getFolders(workspaceId).subscribe(currentFolder => {
      this.workspace.name = currentFolder.name || '';
      this.folders = currentFolder.children || [];
      this.note = currentFolder.note || '';
      this.flashcards = currentFolder.flashcard || [];
      for (let flashcard of this.flashcards) {
        flashcard.question = this.getQuestion(flashcard.question);
      }
    });
  }

  onCreateFolder(event: Event): void {
    event.preventDefault();

    const newFolder: FolderDTO = {
      name: 'New Folder',
      isWorkspace: false,
      parentId: this.workspaceId,
      username: this.username.substring(1, this.username.length - 1)

    };
    
    
    this.notesService.createWorkspace(newFolder).subscribe({
      
      next: () => {
        console.log('Folder created.');
        if (this.workspaceId) {
          this.loadWorkspaceData(this.workspaceId);
        }
      },
      error: err => {
        console.error('Error creating folder:', err);
      }
    });
  }

  onCreateFlashcard(): void {
    this.showFlashcardEditor = true
  }

  cancelEditFlashcard(): void {
    this.showFlashcardEditor = false
  }

  saveFlashcardTitle(): void {
    if (this.workspaceId === null) {
      console.error('Workspace ID is null. Cannot create flashcard.');
      return;
    }

    const editingFlashcard: FlashcardDTO = {
      title: this.editingFlashcard.title,
      question: "Question",
      answer: "Answer",
      folderId: this.workspaceId
    };

    this.notesService.createFlashcard(editingFlashcard).subscribe({
      next: () => {
        console.log('Flashcard created.');
        if (this.workspaceId) {
          this.loadWorkspaceData(this.workspaceId);
        }
      },
      error: err => {
        console.error('Error creating flashcard:', err);
      }
    });

    this.showFlashcardEditor = false
  }

  openFolder(folderId: string): void {
    this.router.navigate(['/workspace', folderId]);
  }

  startSession(){
    this.router.navigate(['/session', this.workspaceId]);
  }

  getQuestion(question: string){
    let text="";
    const array=this.divideByIdentifier(question);
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element[0]!=="/"){
        text+=element;
      }
    }
    return text;
  }

  private divideByIdentifier(cadena:string) {
    const regex = /#\$(.*?)\$#/g;
    const resultado = [];
    let lastIndex = 0; // Índice de seguimiento para el texto no capturado
    let match;

    while ((match = regex.exec(cadena)) !== null) {
        // Agregamos el texto antes del delimitador actual
        if (match.index > lastIndex) {
            resultado.push(cadena.slice(lastIndex, match.index));
        }

        // Agregamos el contenido capturado entre #$ y $#
        resultado.push(match[1]);
        lastIndex = regex.lastIndex; // Actualizamos el índice de seguimiento
    }

    // Agregamos cualquier texto restante después del último delimitador
    if (lastIndex < cadena.length) {
        resultado.push(cadena.slice(lastIndex));
    }
    return resultado.map(item => item.trim());
  }

  openFlashcard(flashcardId: number, workspaceId: any): void {
    localStorage.setItem('workspaceId', workspaceId.toString());
    this.router.navigate(['/flashcard', flashcardId]);
  }

  saveWorkspaceName(): void {
    this.notesService.updateFolder(this.workspaceId, this.workspace.name).subscribe({
      next: () => {
        console.log('Name updated.');
        this.updateWorkspace.updateName(this.workspaceId, this.workspace.name);
      },
      error: err => {
        console.error('Error updating name:', err);
      }
    });
  }

  deleteFolderConfirmation(): void {
    this.showDeleteConfirmation = true;
  }

  cancelDeleteFolder(): void {
    this.showDeleteConfirmation = false;
  }

  deleteFolder(): void {
    this.updateWorkspace.deleteFolder(this.workspaceId) 
    this.notesService.moveToRecycleBin(this.workspaceId!).subscribe({
      next: () => {
        console.log('Folder deleted.');
        this.router.navigate(['/']);
      },
      error: err => {
        console.error('Error deleting folder:', err);
      }
    });
    this.showDeleteConfirmation = false;
  }

  uploadFolder(): void {
    this.uploading=true;
  }

  saveWorkspaceDetails(): void {
    this.notesService.suscribeToCommunityWorkspace(this.workspaceId, this.workspace.description, this.workspace.img).subscribe({
      next: () => {
        console.log('Folder uploaded.');
      },
      error: err => {
        console.error('Error uploading folder:', err);
      }
    });
    this.uploading=false;
  }

  cancelUpload() {
    this.uploading = false;
  }

  goToStats():void{
    this.router.navigate(['/stats', this.workspaceId]);
  }

  toggleFoldersVisibility(): void {
    this.visibleFolders = !this.visibleFolders;
  }
}
