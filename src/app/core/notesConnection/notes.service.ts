import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import axios from "axios";
import { FlashcardDTO } from "../../../Interface/flashcard.dto";
import { FolderDTO } from "../../../Interface/folder.dto";

@Injectable({
    providedIn: 'root'
})
export class NotesService {

    private urlNotes = 'https://s2vw8j8h-3000.brs.devtunnels.ms';

    constructor() {}

    async getFlashcards(folderId:number): Promise<FlashcardDTO[]> {
        try {
            const response = (await axios.get(`${this.urlNotes}/flashcards/${folderId}`)).data;
            return response;
        } catch (error) {
            throw new HttpErrorResponse({ error });
        }
    }

    async createFlashcard(body:FlashcardDTO): Promise<void> {
        try {
            const response = (await axios.post(`${this.urlNotes}/flashcards`,body)).data;
            return response;
        }
        catch (error) {
            throw new HttpErrorResponse({ error });
        }
    }

    async getFolder(folderId:number): Promise<FolderDTO[]> {
        try {
            const response = (await axios.get(`${this.urlNotes}/folder/${folderId}`)).data;
            return response;
        }
        catch (error) {
            throw new HttpErrorResponse({ error });
        }
    }

    async getNote(): Promise<void> {
        // todo
    }

    async deleteNote(): Promise<void> {
        // todo
    }

    async updateNote(): Promise<void> {
        // todo
    }
}