import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../core/notesConnection/notes.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { FormsModule } from '@angular/forms';
import { DayDataDTO } from '../../../Interface/dayData.dto';
import { title } from 'process';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterModule, GoogleChartsModule, FormsModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})

export class StatsComponent implements OnInit {
  workspace = {
    name: 'Workspace',
  };
  folders: any[] = [];
  workspaceId: number | null = null;

  
  //heatmap

  totalFlashcardsData = {
    type: 'Calendar' as ChartType,
    data: [] as [Date, number][], // [['2023-01-01', 1], ['2023-01-02', 2]]
    columns: ['Date', 'Score'],
    options: {
      title: 'Daily score',
      backgroundColor: '#F2F2F2',
      calendar: {
        cellSize: 17,
        yearLabel: { fontSize: 1 },
      },
      colorAxis: {
        minValue: 0,
        colors: ['#e0f2f1', '#00796b'] // desde verde claro a verde oscuro
      },
    },
    width: 1000,
    height: 300
  };
  

  //bar chart
  amountOfFlashcards: Array<{ folderName: string; amount: number }> = []
  barChart = {
    type: 'ColumnChart' as ChartType, 
    data: [] as [string, number][], // this.amountOfFlashcards.map((folder) => [folder.folderName, folder.amount])
    columns: ["Folder's name", 'Amount of flashcards'],
    options: {
      title: 'Amount of flashcards',
      backgroundColor: '#F2F2F2', 
      colors: ['#3366cc'], // Color de las barras
      legend: { position: 'none' }, 
      hAxis: { title: "Folder's name" },
      vAxis: { title: "flashcards" },
    },
    width: 1000,
    height: 400
  };
  // Line chart
  lineChart = {
    type: 'LineChart' as ChartType,
    data: [] as [string, number][], // this.lineChart.data = stats.timePerDay.map((date: string, timeStudied: number) => [date, timeStudied]);
    columns: ['Date', 'Time studied'],
    options: {
      title: 'Time studied daily',
      backgroundColor: '#F2F2F2', 
      colors: ['#3366cc'], // Color de la línea
      legend: { position: 'none' }, 
      hAxis: { title: 'Date' },
      vAxis: { title: 'Time studied (minutes)' },
    },
    width: 1000,
    height: 400
  };

  // pie 1
  daysStudied = {  
    type: 'PieChart' as ChartType,
    data: [] as [string, number][], // [['Studied', 10], ['Not studied', 20]]
    columns: ['Studied', 'Days'],
    options: {
      title: 'Days studied in the last 30 days',
      backgroundColor: '#F2F2F2',
      lengend:{ position: 'none' },

    },
    width: 400,
    height: 400
  };

  // pie 2
  totalFlashcards = 0;
  idealScore = {  
    type: 'PieChart' as ChartType,
    data: [] as [string, number][], // [['Studied', 10], ['Not studied', 20]]
    columns: ['Tarea', 'Horas por día'],
    options: {
      title: 'Succesful ratio',
      backgroundColor: '#F2F2F2',
      lengend:{ position: 'none' },

    },
    width: 400,
    height: 400
  };

  //simple stats 1
  bestStrike:number=0;
  //simple stats 2
  totalStudySessions: number = 0;
  //simple stats 3
  avarageScore:number=0;


  year: number = new Date().getFullYear();
  data: DayDataDTO[] = [];

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
            //heatmap
            this.totalFlashcardsData.data = stats.scorePerDay.map((stat:{date:string; score:number}) => [new Date(stat.date), stat.score]);
            
            //bar chart
            this.barChart.data = stats.amountsOfFlashcards.map((stat:{folderName: string; amount: number} ) => [stat.folderName, stat.amount]);

            //line chart
            this.lineChart.data = stats.timePerDay.map((stat:{date: string; time: number}) => [stat.date, stat.time/60]);
            // simple stats
            this.bestStrike = stats.bestStrike;
            this.totalStudySessions = stats.totalStudySessions;
            this.avarageScore = stats.avarageScore;

            //pie chart 1
            this.daysStudied.data= [['Studied',stats.daysStudiedInLast30Days],['Not Studied',30-stats.daysStudiedInLast30Days]];

            // pie chart 2
            const currentScore = stats.scorePerDay.filter((stat:{date:string; score:number})=>{
              const date = new Date(stat.date);
              date.setDate(date.getDate() + 1);
              const currentDate = new Date();
              return date.toString().substring(0,15)===currentDate.toString().substring(0,15);
            })[0]?.score;
        
            stats.amountsOfFlashcards.map((stat:{folderName: string; amount: number})=>this.totalFlashcards+=stat.amount)
            this.idealScore.data = [['Ideal Score',this.totalFlashcards],['Real Score', !currentScore ? 0 : currentScore]];
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


  goToWorkspace():void{
    this.router.navigate(['/workspace', this.workspaceId]);
  }
}
