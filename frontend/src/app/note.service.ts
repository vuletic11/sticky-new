import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Note } from './models/note.model';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private webReqService: WebRequestService) { }

  //Request to create list
  createList(title: string){
    return this.webReqService.post('lists', {title});
  }

  updateList(id: string, title:string){
    return this.webReqService.patch(`lists/${id}`, {title});
  }

  updateNote(noteId: string, listId:string, title:string){
    return this.webReqService.patch(`lists/${listId}/notes/${noteId}`, {title});
  }

  deleteList(id:string){
    return this.webReqService.delete(`lists/${id}`)
  }

  
  deleteNote(listId:string, noteId:string){
    return this.webReqService.delete(`lists/${listId}/notes/${noteId}`)
  }

  getLists(){
    return this.webReqService.get('lists');
  }

  getNotes(listId: string)  {
    return this.webReqService.get(`lists/${listId}/notes`);
  }

  createNote(title: string, listId: string){
    return this.webReqService.post(`lists/${listId}/notes`, {title});
  }

  complete(note: Note){
    return this.webReqService.patch(`lists/${note._listId}/notes/${note._id}`, {
      completed: !note.completed
    });
  }
}
