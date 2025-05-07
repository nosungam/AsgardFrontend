import { CommonModule } from "@angular/common"
import { Component, type OnInit } from "@angular/core"
import { RouterModule } from "@angular/router"
import { NotesService } from "../../core/notesConnection/notes.service"
import { AuthService } from "../../core/auth/auth.service"
import { CreateEventDTO } from "../../../Interface/createEvent.dto"
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateEventDTO } from "../../../Interface/updateEvent.dto"

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
}

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./calendar.component.html",
  styleUrl: "./calendar.component.css",
})
export class CalendarComponent implements OnInit {
  uploading = false
  editing = false
  today: Date = new Date();
  currentMonth: Date = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  selectedDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
  calendarDays: CalendarDay[] = []
  username = ""
  daysOfWeek: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  counter: number = 0
  selectedEventId: number = -1

  events: CreateEventDTO[] = []
  editingEventForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: [''],
    startHour: [''],
    endHour: [''],
    color: ['blue']
});;

  constructor(
    private notesService: NotesService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
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

  addEvent(date: Date): void {
    // Initialize a new event with the selected date
    this.editingEventForm.reset()

    this.editingEventForm.setValue({
      startDate: date.toISOString().substring(0, 10),
      endDate: null,
      title: null,
      startHour: null,
      endHour: null,
      color: null
    })

    this.uploading = true
  }

  saveEvent(): void {
    console.log("Event data:", this.editingEventForm.value)
    // Validate form
    if (this.editingEventForm.invalid) {
      alert("Please fill in the required fields")
      return
    }
    // Validate dates
    if (!this.datesValidation(this.editingEventForm.value.startDate, this.editingEventForm.value.endDate)) {
      alert("La fecha de inicio no puede ser mayor que la fecha de fin");
      return;
    }
    // Make sure dates are properly formatted before sending to backend
    this.editingEventForm.value.startDate = this.addOneDay(this.editingEventForm.value.startDate).toISOString().substring(0, 10)
    this.editingEventForm.value.endDate = this.editingEventForm.value.endDate ? this.addOneDay(this.editingEventForm.value.endDate).toISOString().substring(0, 10) : null

    const formatedEvent: CreateEventDTO = {
      title: this.editingEventForm.value.title || '', // Ensure title is always a string
      startDate: this.editingEventForm.value.startDate ? new Date(this.editingEventForm.value.startDate) : new Date(),
      endDate: this.editingEventForm.value.endDate ? new Date(this.editingEventForm.value.endDate) : null,
      color: this.editingEventForm.value.color || 'blue', // Default color if not provided
      startHour: this.editingEventForm.value.startHour || null,
      endHour: this.editingEventForm.value.endHour || null,
    }

    this.notesService.createEvent(formatedEvent, this.username).subscribe({
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
        this.editingEventForm.reset()
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

  eventEditor(event: any): void {
    console.log(event.startDate, typeof event.startDate)
    // Detener la propagación del evento para evitar que se active selectDate
    window.event?.stopPropagation();

    this.selectedEventId = event.id || -1
    
    // Crear una copia del evento para evitar modificar el original directamente
    this.editingEventForm.setValue({
      title: event.title,
      startDate: this.subOneDay(event.startDate).toISOString().substring(0, 10),
      endDate: event.endDate ? this.subOneDay(event.endDate).toISOString().substring(0, 10) : null,
      startHour: event.startHour ? event.startHour : null,
      endHour: event.endHour ? event.endHour : null,
      color: event.color || 'blue'
    });
    
    // Mostrar el formulario de edición
    this.editing = true;
  }

  cancelEventEdit(): void {
    this.uploading = false;
    this.editing = false;
  }

  updateEvent(): void {
    // Validar formulario
    if (this.editingEventForm.invalid) {
        alert("Por favor complete los campos requeridos");
        return;
    }
    // Validar fechas
    if (!this.datesValidation(this.editingEventForm.value.startDate, this.editingEventForm.value.endDate)) {
        alert("La fecha de inicio no puede ser mayor que la fecha de fin");
        return;
    }

    // Asegurarse de que las fechas estén correctamente formateadas
    this.editingEventForm.value.startDate = this.addOneDay(this.editingEventForm.value.startDate).toISOString().substring(0, 10)
    this.editingEventForm.value.endDate = this.editingEventForm.value.endDate ? this.addOneDay(this.editingEventForm.value.endDate).toISOString().substring(0, 10) : null

    const upadatedEvent:UpdateEventDTO = {
      title: this.editingEventForm.value.title || '', // Asegurarse de que el título sea siempre una cadena
      startDate: this.editingEventForm.value.startDate ? new Date(this.editingEventForm.value.startDate) : new Date(),
      endDate: this.editingEventForm.value.endDate ? new Date(this.editingEventForm.value.endDate) : null,
      color: this.editingEventForm.value.color || 'blue', // Color predeterminado si no se proporciona
      startHour: this.editingEventForm.value.startHour || null,
      endHour: this.editingEventForm.value.endHour || null,
    }

    // Llamar al servicio para actualizar el evento
    this.notesService.updateEvent(this.selectedEventId, upadatedEvent).subscribe({
      next: (updatedEvent) => {
          console.log("Evento actualizado:", updatedEvent);
      },
      error: (err) => {
          console.error("Error al actualizar el evento:", err);
      },
      complete: () => {
          // Cerrar el editor y actualizar la lista de eventos
          this.editing = false;
          this.refreshEvents();
      }
    });
    
  }

  // Método para eliminar un evento
  deleteEvent(): void {
      if (confirm("¿Está seguro que desea eliminar este evento?")) {
          if (this.selectedEventId !== -1) {
              this.notesService.deleteEvent(this.selectedEventId).subscribe({
                  next: () => {
                      console.log("Evento eliminado");
                      
                      // Eliminar el evento del array local
                      this.events = this.events.filter(e => e.id !== this.selectedEventId);
                  },
                  error: (err) => {
                      console.error("Error al eliminar el evento:", err);
                  },
                  complete: () => {
                      // Cerrar el editor y actualizar la lista de eventos
                      this.editing = false;
                      this.refreshEvents();
                  }
              });
          } else {
              console.error("Event ID is undefined, cannot delete event.");
          }
      }
  }

  // Método auxiliar para actualizar la lista de eventos
  refreshEvents(): void {
      this.notesService.getEvents(this.username).subscribe({
          next: (events) => {
              console.log("Eventos actualizados:", events);
              this.events = events;
          },
          error: (err) => {
              console.error("Error al obtener eventos:", err);
          }
      });
  }

  addOneDay(date: any): Date {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 1)
    return newDate
  }
  subOneDay(date: any): Date {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() - 1)
    return newDate
  }

  datesValidation(startDate: any, endDate: any): boolean {  
    if (startDate && endDate){const start = new Date(startDate)
    const end = new Date(endDate)
    return start.getTime() <= end.getTime()}
    return true
  } 
}
