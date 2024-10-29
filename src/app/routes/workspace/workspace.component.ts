import { Component } from '@angular/core';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent {
  folders = [
    {
      name: 'Folder 1',
    },
    {
      name: 'Folder 2',
    },
    {
      name: 'Folder 3',
    }
  ];
  flashcards = [
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg',
      title: 'What is the capital of Spain?',
      question: 'This is a question',
      answer: 'Madrid',
    },
    {
      image: '',
      title: 'What is the capital of France?',
      question: 'This is a question',
      answer: 'Paris',
    },
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg',
      title: 'What is the capital of Italy?',
      answer: 'Rome',
      question: 'This is a question',
    }
  ];
}
