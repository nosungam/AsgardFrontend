import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { NotesService } from '../../core/notesConnection/notes.service';

@Component({
  selector: 'app-study-session',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './study-session.component.html',
  styleUrl: './study-session.component.css'
})
export class StudySessionComponent {
  workspaceId: number | null = null;
  folderName: string = '';
  flashcard: any;

  constructor(private router: Router, private route: ActivatedRoute, private notesService: NotesService) {}

  async ngOnInit(){
    this.route.paramMap.subscribe(paramMap => {
      this.workspaceId = paramMap.get("id") ? parseInt(paramMap.get("id")!, 10) : null;
      if (this.workspaceId) {
        this.notesService.getFolders(this.workspaceId).subscribe(currentFolder => {
          this.folderName = currentFolder.name || '';
        });
        this.notesService.getRandomFlashcard(this.workspaceId).subscribe(currentFolder => {
          console.log(currentFolder);
          this.flashcard = currentFolder;
        });
      }
    })
  }

  stopSession(){
    this.route.paramMap.subscribe(paramMap => {
      this.workspaceId = paramMap.get("id") ? parseInt(paramMap.get("id")!, 10) : null;
      this.router.navigate(['/workspace/', this.workspaceId]);
    });
  }

  nextQuestion(){
    window.location.reload();
  }
}
