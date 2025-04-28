import { Injectable } from "@angular/core";
import { NotesService } from "../notesConnection/notes.service";

@Injectable({
    providedIn: 'root',
})
export class UpdateWorkspaceService {
    folders: any[] = [];

    constructor(private notesService: NotesService) {}

    deleteFolder(folderId: number): void {
        this.folders = this.folders.filter(folder => folder.id !== folderId);
    }

    updateName(folderId: number, newName: string): void {
        this.folders = this.folders.map(folder => {
            if (folder.id === folderId) {
                return { ...folder, name: newName };
            }
            return folder;
        })}
    
    updateFolders(username: string):void {
        this.notesService.getWorkspaces(username).subscribe(currentFolder => {
            this.folders = currentFolder;
        })
    }
}