import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css'
})
export class TemplateComponent {
}
