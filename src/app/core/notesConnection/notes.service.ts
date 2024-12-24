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
        return this.http.post<void>(`${urlNotes}/flashcard`, body)
            .pipe(catchError(this.handleError));
    }

    getFolders(parentId: number): Observable<FolderDTO> {
        return this.http.get<FolderDTO>(`${urlNotes}/folder/${parentId}`)
            .pipe(catchError(this.handleError));
    }

    getWorkspaces(): Observable<FolderDTO[]> {
        return this.http.get<FolderDTO[]>(`${urlNotes}/folder/`)
            .pipe(catchError(this.handleError));
        
    }

    createWorkspace(body: FolderDTO): Observable<void> {
        return this.http.post<void>(`${urlNotes}/folder/`, body)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        console.error('HTTP Error:', error);
        return throwError(() => error);
    }

    getNote(): Observable<String> {
        return this.http.get<string>(`${urlNotes}/note`)
            .pipe(catchError(this.handleError));
    }

    // async deleteNote(): Promise<void> {
    //     return this.http.delete<void>(`${urlNotes}/note`);
    // }

    updateNote(noteContent: string): Observable<void> {
        const url = `${urlNotes}/note`;
        return this.http.put<void>(url, { content: noteContent });
    }
}