import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NotesService } from '../../core/notesConnection/notes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  workspace = {
    name: 'Workspace',
  };
  folders: any[] = [];
  workspaceId: number | null = null;
  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef | undefined;

  constructor(private notesService: NotesService, private router: Router, private route: ActivatedRoute) {}

  async ngOnInit() {
    try {
      this.route.paramMap.subscribe(paramMap => {
        this.workspaceId = paramMap.get("id") ? parseInt(paramMap.get("id")!, 10) : null;
        if (this.workspaceId) {
          this.notesService.getFolders(this.workspaceId).subscribe(currentFolder => {
            this.workspace.name = currentFolder.name || '';
            this.folders = currentFolder.children || [];
            console.log(this.folders);
            console.log(currentFolder);
            
            
          });
          this.notesService.getStats(this.workspaceId).subscribe(stats => {
            console.log('Stats:', stats);
            // Aquí puedes usar los datos de stats para renderizar el gráfico
          });
          this.createChart();  // Llamamos a createChart
        }
      });
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }

  private createChart(): void {
    // Datos para el gráfico de flashcards por workspace (hardcodeados)
    const workspaces = [
      { name: "Workspace 1", flashcards: 50 },
      { name: "Workspace 2", flashcards: 50 }
    ];

    // Parámetros del gráfico
    const barHeight = 25;
    const marginTop = 30;
    const marginRight = 0;
    const marginBottom = 10;
    const marginLeft = 100;
    const width = 928;
    const height = Math.ceil((workspaces.length + 0.1) * barHeight) + marginTop + marginBottom;

    // Crear las escalas
    const x = d3.scaleLinear()
      .domain([0, d3.max(workspaces, d => d.flashcards) || 0])
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleBand()
      .domain(d3.sort(workspaces, d => -d.flashcards).map(d => d.name))
      .rangeRound([marginTop, height - marginBottom])
      .padding(0.1);

    // Seleccionar el contenedor para insertar el SVG
    const svg = d3.select(this.chartContainer?.nativeElement)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Agregar rectángulos (barras) para cada workspace
    svg.append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(workspaces)
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d) => y(d.name) ?? 0)
      .attr("width", (d) => x(d.flashcards) - x(0))
      .attr("height", y.bandwidth());

    // Agregar etiquetas de texto para cada barra
    svg.append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .selectAll()
      .data(workspaces)
      .join("text")
      .attr("x", (d) => x(d.flashcards))
      .attr("y", (d) => (y(d.name)! + y.bandwidth() / 2))
      .attr("dy", "0.35em")
      .attr("dx", -4)
      .text((d) => d.flashcards) // Muestra la cantidad de flashcards
      .call((text) => text.filter(d => x(d.flashcards) - x(0) < 20) // para barras cortas
        .attr("dx", +4)
        .attr("fill", "black")
        .attr("text-anchor", "start"));

    // Agregar los ejes X y Y
    svg.append("g")
      .attr("transform", `translate(0,${marginTop})`)
      .call(d3.axisTop(x).ticks(width / 80, "%"))
      .call(g => g.select(".domain").remove());

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0));
  }
}
