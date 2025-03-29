import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FlashcardDTO } from "../../../Interface/flashcard.dto";
import { FolderDTO } from "../../../Interface/folder.dto";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { PromptDTO } from "../../../Interface/prompt.dto";
import { AnswerDTO } from "../../../Interface/answer.dto";
import { StatsDTO } from "../../../Interface/stats.dto";
import { SkipedDTO } from "../../../Interface/skiped.dto";
import { UpdateEventDTO } from "../../../Interface/updateEvent.dto";
import { CreateEventDTO } from "../../../Interface/createEvent.dto";

const urlNotes = 'http://localhost:3000';

@Injectable({
    providedIn: 'root'
})
export class NotesService {
    constructor(private http: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('HTTP Error:', error);
        return throwError(() => error);
    }

    getFlashcards(folderId: number): Observable<FolderDTO[]> {
        return this.http.get<FolderDTO[]>(`${urlNotes}/flashcard/${folderId}`)
            .pipe(catchError(this.handleError));
    }

    createFlashcard(body: FlashcardDTO): Observable<void> {
        return this.http.post<void>(`${urlNotes}/flashcard`, { title: body.title, question: body.question, answer: body.answer, folderId: body.folderId })
            .pipe(catchError(this.handleError));
    }

    getFolders(parentId: number): Observable<FolderDTO> {
        return this.http.get<FolderDTO>(`${urlNotes}/folder/${parentId}`)
            .pipe(catchError(this.handleError));
    }

    getWorkspaces(user:string): Observable<FolderDTO[]> {
        return this.http.get<FolderDTO[]>(`${urlNotes}/workspaces/${user}`) 
            .pipe(catchError(this.handleError));

    }

    createWorkspace(body: FolderDTO): Observable<void> {
        return this.http.post<void>(`${urlNotes}/folder/`, body)
            .pipe(catchError(this.handleError));
    }

    updateNote(note: string, folderId: number): Observable<FolderDTO> {
        const body = { note: note }
        return this.http.put<FolderDTO>(`${urlNotes}/folder/${folderId}`, body)
            .pipe(catchError(this.handleError));
    }

    createStudySession(folderId: number): Observable<{ id: number }> {
        return this.http.post<{ id: number }>(`${urlNotes}/study-session/create/${folderId}`, {})
            .pipe(catchError(this.handleError));
    }

    getRandomFlashcard(folderId: number): Observable<FlashcardDTO> {
        return this.http.get<FlashcardDTO>(`${urlNotes}/study-session/${folderId}`)
            .pipe(catchError(this.handleError));
    }

    search(body: PromptDTO): Observable<any[]> {
        return this.http.put<any[]>(`${urlNotes}/search-engine`, { ...body })
            .pipe(catchError(this.handleError));
    }

    answerFlashcard(body: AnswerDTO, sessionId:number): Observable<void> {
        return this.http.post<void>(`${urlNotes}/study-session/${sessionId}`, body, )
            .pipe(catchError(this.handleError));
    }

    getStats(folderId: number): Observable<any> {
        return this.http.get<StatsDTO>(`${urlNotes}/study-session/stats/${folderId}`)
            .pipe(catchError(this.handleError));
    }

    skipFlashcard(body: SkipedDTO): Observable<any> {
        return this.http.get<any>(`${urlNotes}/study-session/skip/${body.folderId}/${body.flashcardId}`)
            .pipe(catchError(this.handleError));
    }

    getFlashcard(flashcardId: number): Observable<FlashcardDTO> {
        return this.http.get<FlashcardDTO>(`${urlNotes}/flashcard/${flashcardId}`)
            .pipe(catchError(this.handleError));
    }

    updateFlashcard(body: FlashcardDTO): Observable<void> {
        return this.http.put<void>(`${urlNotes}/flashcard/${body.id}`, body)
            .pipe(catchError(this.handleError));
    }

    moveToRecycleBin(folderId: number): Observable<void> {
        return this.http.put<void>(`${urlNotes}/recycle-bin/${folderId}`, {})
            .pipe(catchError(this.handleError));
    }

    updateFolder(folderId: number,name:string): Observable<void> {
        return this.http.put<void>(`${urlNotes}/${name}/${folderId}`, {})
            .pipe(catchError(this.handleError));
    }

    getCommunityWorkspaces(): Observable<FolderDTO[]> {
        return this.http.get<FolderDTO[]>(`${urlNotes}/community-workspaces`)
            .pipe(catchError(this.handleError));
    }

    getfoldersInRecycleBin(user: string): Observable<FolderDTO[]> {
        return this.http.get<FolderDTO[]>(`${urlNotes}/recycle-bin/${user}`) 
            .pipe(catchError(this.handleError));
    }

    restoreFolder(folderId: number): Observable<void> {
        return this.http.put<void>(`${urlNotes}/restore/${folderId}`, {})
            .pipe(catchError(this.handleError));
    }

    deleteFolder(folderId: number): Observable<void> {
        return this.http.delete<void>(`${urlNotes}/folder/${folderId}`)
            .pipe(catchError(this.handleError));
    }

    suscribeToCommunityWorkspace(folderId: number, description: string, img: string): Observable<void> {
        return this.http.put<void>(`${urlNotes}/community-workspaces`, { id: folderId, description, img })
            .pipe(catchError(this.handleError));
    }

    createEvent(body: CreateEventDTO, user: string): Observable<CreateEventDTO> {
        return this.http.post<CreateEventDTO>(`${urlNotes}/calendar/event/${user}`, body)
            .pipe(catchError(this.handleError));
    }

    deleteEvent(id: number): Observable<void> {
        return this.http.delete<void>(`${urlNotes}/calendar/event/${id}`)
            .pipe(catchError(this.handleError));
    }

    getEvents(user: string): Observable<CreateEventDTO[]> {
        return this.http.get<CreateEventDTO[]>(`${urlNotes}/calendar/events/${user}`)
            .pipe(catchError(this.handleError));
    }

    updateEvent(id: number, body: UpdateEventDTO): Observable<void> {
        return this.http.put<void>(`${urlNotes}/calendar/event/${id}`, body)
            .pipe(catchError(this.handleError));
    }

    cloneCommunityWorkspace(folderId: number, user:string): Observable<void> {
        return this.http.post<void>(`${urlNotes}/community-workspaces`, { id: folderId, user })
            .pipe(catchError(this.handleError));
    }
}