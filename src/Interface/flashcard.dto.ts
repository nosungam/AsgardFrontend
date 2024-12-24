export interface FlashcardDTO {
    id?: number
    title: string;
    question: string;
    answer: string;
    image?: string;
    folderId: number;
}