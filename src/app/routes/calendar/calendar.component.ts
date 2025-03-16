import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
}

interface Event {
  id: string
  title: string
  date: Date
  color: "green" | "blue" | "purple" | "default"
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit{
  currentMonth: Date = new Date(2025, 0, 1) // January 2025
  selectedDate: Date = new Date(2025, 0, 22) // January 22, 2025
  calendarDays: CalendarDay[] = []
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

  events: Event[] = [
    { id: "1", title: "Cumple Agos", date: new Date(2024, 11, 31), color: "green" },
    { id: "2", title: "Fiesta de Fin de Año", date: new Date(2024, 11, 31), color: "blue" },
    { id: "3", title: "Año Nuevo", date: new Date(2025, 0, 1), color: "blue" },
    { id: "4", title: "Cumple Nazza", date: new Date(2025, 0, 4), color: "purple" },
    { id: "5", title: "Cumple Cesano", date: new Date(2025, 0, 8), color: "green" },
    { id: "6", title: "Cumple Caro S", date: new Date(2025, 0, 23), color: "green" },
    { id: "7", title: "Cumple Bruno", date: new Date(2025, 0, 30), color: "green" },
    { id: "8", title: "Cumple Pablo", date: new Date(2025, 1, 2), color: "green" },
  ]

  ngOnInit(): void {
    this.generateCalendarDays()
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

  getEventsForDay(date: Date): Event[] {
    return this.events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  getEventsForMonth(): Event[] {
    return this.events.filter((event) => event.date.getMonth() === this.currentMonth.getMonth())
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
}
