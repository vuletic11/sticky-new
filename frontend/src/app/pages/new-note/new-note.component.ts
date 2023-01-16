import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/models/note.model';
import { NoteService } from 'src/app/note.service';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';

@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrls: ['./new-note.component.scss']
})
export class NewNoteComponent implements OnInit {

  constructor(private noteService:NoteService, private route:ActivatedRoute, private router:Router) { }

  listId: string;
  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
        this.listId= params['listId'];
      })
    
  }

  createNote(title:string){
    this.noteService.createNote(title, this.listId).subscribe(newNote =>{
      this.router.navigate(['../'], {relativeTo: this.route});
    });
  }
}
