export interface CreateEventDTO {
    title: string;
    startDate: Date;
    endDate?: Date;
    color: string;
    startHour?: string;
    endHour?: string;
}