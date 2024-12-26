import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-study-session',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './study-session.component.html',
  styleUrl: './study-session.component.css'
})
export class StudySessionComponent {
  workspaceId: number | null = null;

  constructor(private router: Router) {}

  stopSession(){
    this.workspaceId = paramMap.get("id") ? parseInt(paramMap.get("id")!, 10) : null;
    this.router.navigate(['/session', this.workspaceId]);
  }
}
