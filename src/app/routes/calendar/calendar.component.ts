import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotesService } from '../../core/notesConnection/notes.service';
import { AuthService } from '../../core/auth/auth.service';
import { CreateEventDTO } from '../../../Interface/createEvent.dto';
import { FormsModule } from '@angular/forms';

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit{
  uploading: boolean = false;
  currentMonth: Date = new Date(2025, 0, 1) // January 2025
  selectedDate: Date = new Date(2025, 0, 22) // January 22, 2025
  calendarDays: CalendarDay[] = []
  username: string = ''
  daysOfWeek: string[] = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  monthNames: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  events: CreateEventDTO[] = []
  editingEvent: CreateEventDTO = {
    title: '',
    startDate: new Date(),
    endDate: new Date(),
    color: 'blue',
    startHour: '',
    endHour: ''
  };

  constructor(private notesService: NotesService, private authService: AuthService) { }

  ngOnInit(): void {
    this.username = (localStorage.getItem('email') || '').replace(/^"(.*)"$/, '$1');
    this.generateCalendarDays()
    this.notesService.getEvents(this.username).subscribe({
      next: (events) => {
        console.log('Events:', events);
        this.events = events;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  generateCalendarDays(): void {
    this.calendarDays = []
    const year = this.currentMonth.getFullYear()
    const month = this.currentMonth.getMonth()

    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = this.getDaysInMonth(year, month)
    const daysInPrevMonth = this.getDaysInMonth(year, month - 1)

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      this.calendarDays.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    // Next month days
    const remainingDays = 42 - this.calendarDays.length // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      this.calendarDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      })
    }
  }

  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate()
  }

  getEventsForDay(date: Date): CreateEventDTO[] {
    
    return this.events.filter((event) => {
      const startDate = new Date(event.startDate);
      const endDate = event.endDate ? new Date(event.endDate) : new Date(0);
      return (
        startDate.getDate() === date.getDate() &&
        startDate.getMonth() === date.getMonth() &&
        startDate.getFullYear() === date.getFullYear()
      );
    });
  }

  getEventsForMonth(): CreateEventDTO[] {
    return this.events.filter((event) => event.startDate.getMonth() === this.currentMonth.getMonth())
  }

  formatDate(date: Date): string {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`
  }

  isToday(date: Date): boolean {
    return (
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    )
  }

  selectDate(date: Date): void {
    this.selectedDate = date
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1)
    this.generateCalendarDays()
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1)
    this.generateCalendarDays()
  }

  addEvent(date: Date) {
    this.uploading=true;
  }

  cancelEventEdit() {
    this.uploading=false;
  }

  saveEvent(event: CreateEventDTO): void {
    this.events.push(event)
    console.log(event);
    console.log(this.username);
    
    this.notesService.createEvent(event, this.username).subscribe({
      next: (createdEvent) => {
        console.log('Event created:', createdEvent);
        this.events.push(createdEvent);
      },
      error: err => {
        console.error('Error creating event:', err);
      }
    })
    this.uploading=false;
  }
}
