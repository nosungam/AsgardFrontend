export interface CreateEventDTO {
    id?: number;
    title: string;
    startDate: Date;
    endDate?: Date | null;
    color: string;
    startHour?: string | null;
    endHour?: string | null;
}