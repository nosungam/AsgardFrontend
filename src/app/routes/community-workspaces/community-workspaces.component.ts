import { CommonModule } from "@angular/common"
import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { NotesService } from "../../../../src/app/core/notesConnection/notes.service"
import { UpdateWorkspaceService } from "../../core/util/updateWorkspace.service"
import { debounceTime, Subject } from "rxjs"

@Component({
  selector: "app-community-workspaces",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./community-workspaces.component.html",
  styleUrl: "./community-workspaces.component.css",

  
})


export class CommunityWorkspacesComponent {
  folders: any[] = []
  displayedFolders: any[] = []
  username = ""
  searchTerm = ""
  private searchSubject = new Subject<string>()

  constructor(
    private notesService: NotesService,
    private updateWorkspace: UpdateWorkspaceService,
  ) {
    this.searchSubject
      .pipe(
        debounceTime(300), 
      )
      .subscribe(() => {
        this.performSearch()
      })
  }

  async ngOnInit() {
    try {
      this.username = (localStorage.getItem("email") || "").replace(/^"(.*)"$/, "$1")
      this.loadCommunityWorkspaces()
    } catch (error) {
      console.error("Error fetching community workspaces:", error)
    }
  }

  private loadCommunityWorkspaces(): void {
    this.notesService.getCommunityWorkspaces().subscribe((currentFolder) => {
      this.folders = currentFolder.map((folder) => {
        return {
          ...folder,
          note: this.stripHtmlTags(folder.note || ""),
        }
      })
      this.displayedFolders = [...this.folders]
    })
  }

  private stripHtmlTags(html: string): string {
    const div = document.createElement("div")
    div.innerHTML = html
    return div.textContent || div.innerText || ""
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm)
  }

  private performSearch(): void {
    if (!this.searchTerm.trim()) {
      this.displayedFolders = [...this.folders]
      return
    }
  
    this.notesService.searchCommunityWorkspace({ prompt: this.searchTerm }).subscribe({
      next: (results: any) => {  
        const idsFromDescription = Array.isArray(results.description)
          ? results.description.map((item: any) => item?.id)
          : []
  
        const idsFromTittle = Array.isArray(results.tittle)
          ? results.tittle.map((item: any) => item?.id)
          : []
  
        const allIds = Array.from(new Set([...idsFromDescription, ...idsFromTittle]))
  
        this.displayedFolders = this.folders
          .filter(folder => allIds.includes(folder.id))
          .map(folder => ({
            ...folder,
            note: this.stripHtmlTags(folder.note || "")
          }))
  
        if (this.displayedFolders.length === 0) {
          console.warn("No se encontraron resultados.")
        }

        console.log(this.displayedFolders);
        
      },
      error: (error) => {
        console.error("Error searching workspaces:", error)
      },
    })
  }
  
  

  downloadFolder(folderId: number): void {
    this.notesService.getFolders(folderId).subscribe((currentFolder) => {
      console.log("Folder:", currentFolder)
      this.notesService.cloneCommunityWorkspace(folderId, this.username).subscribe({
        next: () => {
          console.log("Folder downloaded successfully.")
          this.updateWorkspace.updateFolders(this.username)
        },
      })
    })
  }

  deleteFolder(folderId: number): void {
    this.notesService.unsuscribeToCommunityWorkspace(folderId).subscribe(() => {
      console.log("Folder deleted successfully.")
      this.updateWorkspace.updateFolders(this.username)
      this.loadCommunityWorkspaces()
    })
  }
}
