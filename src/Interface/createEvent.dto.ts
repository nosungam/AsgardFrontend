export interface CreateEventDTO {
    title: string;
    strartDate: Date;
    endDate?: Date;
    color: string;
    startHour?: string;
    endHour?: string;
}