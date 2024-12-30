import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { NotesService } from '../../core/notesConnection/notes.service';
import { AnswerDTO } from '../../../Interface/answer.dto';

@Component({
  selector: 'app-study-session',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './study-session.component.html',
  styleUrl: './study-session.component.css'
})
export class StudySessionComponent {
  folderName: string = '';
  sessionId: number | null = null;
  workspaceId: number | null = null;
  flashcard: any;
  answered: boolean = false;
  newAnswer: AnswerDTO = { id: 0, correct: false};


  constructor(private router: Router, private route: ActivatedRoute, private notesService: NotesService) {}

  async ngOnInit(){
    this.answered = false;
    
    this.route.paramMap.subscribe(paramMap => {
      this.workspaceId = paramMap.get("id") ? parseInt(paramMap.get("id")!, 10) : null;
      if (this.workspaceId) {
        this.notesService.getFolders(this.workspaceId).subscribe(currentFolder => {
          this.folderName = currentFolder.name || '';
        });
      }
      this.nextQuestion();
    })

    if (this.workspaceId) {
      this.notesService.createStudySession(this.workspaceId).subscribe(response => {
        this.sessionId = response.id;
      });
    }
  }

  stopSession(){
    this.route.paramMap.subscribe(paramMap => {
      this.workspaceId = paramMap.get("id") ? parseInt(paramMap.get("id")!, 10) : null;
      this.router.navigate(['/workspace/', this.workspaceId]);
    });
  }

  nextQuestion(){
    this.answered = false;
    if (this.workspaceId) {
      this.notesService.getRandomFlashcard(this.workspaceId).subscribe(currentFolder => {
        this.flashcard = currentFolder;
      });
    }
  }

  showAnswer(){
    this.answered = true;
  }

  correctAnswer(){
    this.newAnswer.correct = true
    this.newAnswer.id = this.flashcard.id;
    if (this.sessionId){
      this.notesService.answerFlashcard(this.newAnswer, this.sessionId).subscribe({
        next: () => {
          console.log('Flashcard answered.');
        },
        error: err => {
          console.error('Error answering the flashcard:', err);
        }
      });
    }
    this.nextQuestion();
  }

  incorrectAnswer(){
    this.newAnswer.correct = false
    this.newAnswer.id = this.flashcard.id;
    if (this.sessionId){
      this.notesService.answerFlashcard(this.newAnswer, this.sessionId).subscribe({
        next: () => {
          console.log('Flashcard answered.');
        },
        error: err => {
          console.error('Error answering the flashcard:', err);
        }
      });
    }
    this.nextQuestion();
  }
}
