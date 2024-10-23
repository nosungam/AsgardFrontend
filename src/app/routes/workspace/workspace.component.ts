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
      question: 'What is the capital of Spain?',
      description: 'This is a description',
      answer: 'Madrid',
    },
    {
      image: '',
      question: 'What is the capital of France?',
      description: 'This is a description',
      answer: 'Paris',
    },
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg',
      question: 'What is the capital of Italy?',
      answer: 'Rome',
      description: 'This is a description',
    }
  ];
}
