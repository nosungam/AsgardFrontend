export interface CreateEventDTO {
    id?: number;
    title: string;
    startDate: Date;
    endDate?: Date;
    color: string;
    startHour?: string;
    endHour?: string;
}