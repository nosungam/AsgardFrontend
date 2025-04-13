import { CommonModule } from "@angular/common"
import { Component, type OnInit } from "@angular/core"
import { RouterModule } from "@angular/router"
import { NotesService } from "../../core/notesConnection/notes.service"
import { AuthService } from "../../core/auth/auth.service"
import { CreateEventDTO } from "../../../Interface/createEvent.dto"
import { FormsModule } from "@angular/forms"

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
}

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./calendar.component.html",
  styleUrl: "./calendar.component.css",
})
export class CalendarComponent implements OnInit {
  uploading = false
  today: Date = new Date();
  currentMonth: Date = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  selectedDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
  calendarDays: CalendarDay[] = []
  username = ""
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
  counter: number = 0

  events: CreateEventDTO[] = []
  editingEvent: CreateEventDTO = {
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    color: "blue",
    startHour: "",
    endHour: "",
  }

  constructor(
    private notesService: NotesService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.username = (localStorage.getItem("email") || "").replace(/^"(.*)"$/, "$1")
    this.generateCalendarDays()
    this.notesService.getEvents(this.username).subscribe({
      next: (events) => {
        console.log("Events:", events)
        this.events = events
      },
      error: (err) => {
        console.error("Error fetching events:", err)
      },
    })
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
    if (!this.events || this.events.length === 0) {
      return []
    }
    return this.events.filter((event) => {
      // Ensure we're working with Date objects
      const startDate = event.startDate instanceof Date ? event.startDate : new Date(event.startDate)

      // Check if the event is for this day
      const sameDay =
        startDate.getDate() === date.getDate() &&
        startDate.getMonth() === date.getMonth() &&
        startDate.getFullYear() === date.getFullYear()

      if (sameDay) return true

      // If there's an end date, check if the day falls between start and end
      if (event.endDate) {
        const endDate = event.endDate instanceof Date ? event.endDate : new Date(event.endDate)

        // Check if the date is the end date
        const isEndDate =
          endDate.getDate() === date.getDate() &&
          endDate.getMonth() === date.getMonth() &&
          endDate.getFullYear() === date.getFullYear()

        if (isEndDate) return true

        // Check if the date is between start and end
        const currentTime = date.getTime()
        return currentTime >= startDate.getTime() && currentTime <= endDate.getTime()
      }

      return false
    })
  }

  getEventsForMonth(): CreateEventDTO[] {
    return this.events.filter((event) => {
      const startDate = new Date(event.startDate)
      return startDate.getMonth() === this.currentMonth.getMonth()
    })
  }

  formatDate(date: Date | string): string {
    const dateObj = date instanceof Date ? date : new Date(date)
    return `${dateObj.getDate().toString().padStart(2, "0")}/${(dateObj.getMonth() + 1).toString().padStart(2, "0")}`
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
    // Prevent event bubbling if this is triggered by a click event
    event?.stopPropagation()

    // Initialize a new event with the selected date
    this.editingEvent = {
      title: "",
      startDate: date,
      endDate: date,
      color: "blue",
      startHour: "",
      endHour: "",
    }

    this.uploading = true
  }

  cancelEventEdit() {
    this.uploading = false
  }

  saveEvent(eventData: CreateEventDTO): void {
    // Validate form
    if (!eventData.title || !eventData.startDate) {
      alert("Please fill in the required fields")
      return
    }

    // Make sure dates are properly formatted before sending to backend
    const event = {
      ...eventData,
      // Ensure dates are Date objects
      startDate: eventData.startDate instanceof Date ? eventData.startDate : new Date(eventData.startDate),
      endDate: eventData.endDate ? (eventData.endDate instanceof Date ? eventData.endDate : new Date(eventData.endDate)) : new Date(),
    }

    this.notesService.createEvent(event, this.username).subscribe({
      next: (createdEvent) => {
        console.log("Event created:", createdEvent)
        // Add the created event to the events array
        // Make sure not to add it twice since we're getting it from the response
        const exists = this.events.some(
          (e) =>
            e.title === createdEvent.title &&
            new Date(e.startDate).getTime() === new Date(createdEvent.startDate).getTime(),
        )

        if (!exists) {
          this.events.push(createdEvent)
        }
      },
      error: (err) => {
        console.error("Error creating event:", err)
      },
      complete: () => {
        // Reset the form and close the editor
        this.editingEvent = {
          title: "",
          startDate: new Date(),
          endDate: new Date(),
          color: "blue",
          startHour: "",
          endHour: "",
        }
        this.uploading = false
        this.notesService.getEvents(this.username).subscribe({
          next: (events) => {
            console.log("Events:", events)
            this.events = events
          },
          error: (err) => {
            console.error("Error fetching events:", err)
          },
        })
      },
    })
  }
}
