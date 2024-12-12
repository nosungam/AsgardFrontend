import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FlashcardDTO } from "../../../Interface/flashcard.dto";
import { FolderDTO } from "../../../Interface/folder.dto";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

const urlNotes = 'http://localhost:3000';

@Injectable({
    providedIn: 'root'
})
export class NotesService {
    constructor(private http: HttpClient) {}

    getFlashcards(folderId: number): Observable<FolderDTO[]> {
        return this.http.get<FolderDTO[]>(`${urlNotes}/flashcard/${folderId}`)
            .pipe(catchError(this.handleError));
    }

    createFlashcard(body: FlashcardDTO): Observable<void> {
        return this.http.post<void>(`${urlNotes}/flashcards`, body)
            .pipe(catchError(this.handleError));
    }

    getFolders(parentId: number): Observable<FolderDTO[]> {
        return this.http.get<FolderDTO[]>(`${urlNotes}/folder/${parentId}`)
            .pipe(catchError(this.handleError));
    }

    getWorkspaces(): Observable<FolderDTO[]> {
        return this.http.get<FolderDTO[]>(`${urlNotes}/folder/`)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        console.error('HTTP Error:', error);
        return throwError(() => error);
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