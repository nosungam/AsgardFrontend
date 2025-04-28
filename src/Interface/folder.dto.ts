import { FlashcardDTO } from "./flashcard.dto"

export interface FolderDTO {
    id?: number,
    name: string,
    isWorkspace: boolean,
    parentId: number | null,
    note?: string,
    children?: FolderDTO[],
    flashcard?: FlashcardDTO[],
    username: string,
    img?: string,
    description?: string,
}