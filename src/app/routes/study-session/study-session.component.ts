import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { NotesService } from '../../core/notesConnection/notes.service';
import { AnswerDTO } from '../../../Interface/answer.dto';
import { SkipedDTO } from '../../../Interface/skiped.dto';

@Component({
  selector: 'app-study-session',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './study-session.component.html',
  styleUrl: './study-session.component.css'
})
export class StudySessionComponent implements OnInit {
  folderName: string = '';
  sessionId: number | null = null;
  workspaceId: number | null = null;
  flashcard: any;
  answered: boolean = false;
  skiped: SkipedDTO = {flashcardId: 0, folderId: 0};
  questionArray: string[] = [];
  answerArray: string[] = [];

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
    })
    
    if (this.workspaceId) {
      this.notesService.createStudySession(this.workspaceId).subscribe(response => {
        this.sessionId = response.id;
      });
    }
    this.nextQuestion();
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
      this.notesService.getRandomFlashcard(this.workspaceId).subscribe(currentFlashcard => {
        if (currentFlashcard !== null) {
          console.log('hay flashcards')
          console.log(currentFlashcard)
          this.flashcard = currentFlashcard;
          this.questionArray=this.divideByIdentifier(this.flashcard.question);
          this.answerArray=this.divideByIdentifier(this.flashcard.answer);
          
          this.flashcard.question = this.getQuestion(this.flashcard.question);
          this.flashcard.answer = this.getQuestion(this.flashcard.answer);
        }
        else {
          console.log("No hay más preguntas disponibles.");
          this.flashcard = null;
        }
      });
    }
  }

  skipQuestion(){
    if (this.workspaceId !== null) {
      this.skiped = {flashcardId: this.flashcard.id, folderId: this.workspaceId};
    }
    this.notesService.skipFlashcard(this.skiped).subscribe(currentFolder => {
      this.flashcard = currentFolder;
      console.log(currentFolder);
      
      this.questionArray=this.divideByIdentifier(this.flashcard.question);
      this.answerArray=this.divideByIdentifier(this.flashcard.answer);
      this.flashcard.question = this.getQuestion(this.flashcard.question);
      this.flashcard.answer = this.getQuestion(this.flashcard.answer);
    });
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

  isImage(item: string): boolean {
    return item.startsWith('/') && (item.endsWith('.png') || item.endsWith('.jpg'));
  }

  showAnswer(){
    this.answered = true;
  }

  answerFlashcard(correct:boolean){
    if (this.sessionId){
      this.notesService.answerFlashcard({id:this.flashcard.id, correct}, this.sessionId).subscribe({
        next: () => {
          this.nextQuestion();
        },
        error: err => {
          console.error('Error answering the flashcard:', err);
        }
      });
    }
  }
}
