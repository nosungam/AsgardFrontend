import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../core/notesConnection/notes.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { DayDataDTO } from '../../../Interface/dayData.dto';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxChartsModule, FormsModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})

export class StatsComponent implements OnInit {
  workspace = {
    name: 'Workspace',
  };
  folders: any[] = [];
  workspaceId: number | null = null;
  bestStrike: number = 0;
  totalStudySessions: number = 0;

  
  //chart

  totalFlashcardsData: any[] = [
    {
      name: 'Loading...',
      value: 100,
    },
    {
      name: 'Loading...',
      value: 100,
    }
  ];
  view: [number, number] = [700, 400];
    // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Total flashcards';
  yAxisLabel: string = 'Total folders';

  //chart 2

  totalDaysStudiedInLastMonth:number=0
  avaregeDailyScore:number=0;
  avaregeTimePerSession:number=0;
  daysStudied: any[] = [
    {
      name: 'Loading...',
      value: 100,
    }
  ];

  //chart 3

  year: number = new Date().getFullYear();
  data: DayDataDTO[] = [];

  selectedDay: any = null;
  selectedI: number | null = null;
  printedDay: boolean = false;

  cursorX: number = 0;
  cursorY: number = 0;

  constructor(private notesService: NotesService, private router: Router, private route: ActivatedRoute) {
    for (let month = 1; month <= 12; month++) {
      const daysInMonth = new Date(this.year, month, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${this.year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        this.data.push({ date, score: 0, printed: false });
      }
    }
  }

  async ngOnInit() {
    try {
      this.route.paramMap.subscribe(paramMap => {
        this.workspaceId = paramMap.get("id") ? parseInt(paramMap.get("id")!, 10) : null;
        if (this.workspaceId) {
          this.notesService.getFolders(this.workspaceId).subscribe(currentFolder => {
            this.workspace.name = currentFolder.name || '';
            this.folders = currentFolder.children || [];
          });
          this.notesService.getStats(this.workspaceId).subscribe(stats => {
            console.log('Stats:', stats);
            this.updateScore(stats.scorePerDay, this.data);
            console.log(this.data);
            
            this.totalFlashcardsData = stats.amountsOfFlashcards.map((stat: { folderName: string; amount: number }) => ({
              name: stat.folderName,
              value: stat.amount,
            }));
            this.bestStrike = stats.bestStrike;
            this.totalStudySessions = stats.totalStudySessions;
            this.totalDaysStudiedInLastMonth = stats.daysStudiedInLast30Days;
            this.avaregeDailyScore = stats.avarageScore;
            this.avaregeTimePerSession = stats.avarageTimePerSession;
            
            this.daysStudied = [
              { name: 'Days Studied', value: this.totalDaysStudiedInLastMonth },
              { name: 'Avarege Score Per day', value: this.avaregeDailyScore },
              { name: 'Avarege Time Per Session', value:this.avaregeTimePerSession}
            ];
          });
        }
      });
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }

  onSelect(data: any): void {
    console.log(data);
  }

  updateScore(scorePerDay: any[], data: DayDataDTO[]) {
    for (const score of scorePerDay) {
      const dayData = data.find(day => day.date === score.date);
      if (dayData) {
        dayData.score = score.score;
        if (score.score > 0) {
          dayData.printed = true;
        }
      }
    }
  }

  selectDay(day: any, index: number, event: MouseEvent) {
    this.selectedDay = day;
    this.selectedI = index;
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
  }

  closeOverlay() {
    this.selectedDay = null;
    this.selectedI = null;
  }

  goToWorkspace():void{
    this.router.navigate(['/workspace', this.workspaceId]);
  }
}
