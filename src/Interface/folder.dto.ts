import { FlashcardDTO } from "./flashcard.dto"

export interface FolderDTO {
    id: number,
    name: string,
    isWorkspace: boolean,
    parentId: number,
    note: string,
    children: FolderDTO[]
    flashcard: FlashcardDTO[]
}