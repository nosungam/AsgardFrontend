import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import axios from "axios";
import { FlashcardDTO } from "../../../Interface/flashcard.dto";
import { FolderDTO } from "../../../Interface/folder.dto";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class NotesService {

    private urlNotes = 'https://s2vw8j8h-3000.brs.devtunnels.ms';

    constructor(private http: HttpClient) {}

    getFlashcards(folderId: number): Observable<any> {
        return this.http.get<any>(`${this.urlNotes}/flashcards/${folderId}`).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching flashcards:', error);
                return throwError(() => new Error('Error fetching flashcards'));
            })
        );
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

    async getFolders(parentId:number): Promise<FolderDTO[]> {
        try {
            const response = (await axios.get(`${this.urlNotes}/folder/${parentId}`)).data;
            return response;
        }
        catch (error) {
            throw new HttpErrorResponse({ error });
        }
    }

    async getWorkspaces(): Promise<FolderDTO[]> {
        try {
            const response = (await axios.get(`${this.urlNotes}/folder/`)).data;
            console.log(response);
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