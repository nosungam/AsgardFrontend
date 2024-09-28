import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isSidebarCollapsed = input.required<boolean>();
}
