import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { NoteService } from 'src/app/note.service';
import { Note } from 'src/app/models/note.model';
import { List } from 'src/app/models/list.model';
import { subscribeOn } from 'rxjs';


@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.scss']
})
export class NoteViewComponent implements OnInit {
  
  lists: any;
  notes: any;
  id: string;

  selectedListId: string;


  constructor(private noteService: NoteService, private route: ActivatedRoute, private router:Router) { }

  ngOnInit() {

    this.noteService.getLists().subscribe((lists)=>{
      this.lists=lists;
    });  

    this.route.params.subscribe(params => {
      //
      if(params['listId']){
        this.selectedListId= params['listId'];
        this.noteService.getNotes(params['listId']).subscribe((notes)=>{
          this.notes = notes;
          console.log(notes)
          console.log(this.notes)
        }); 
      } else{
        this.notes = undefined;
      }
      // ispod je original
      // this.noteService.getNotes(params['listId']).subscribe((notes)=>{
      //   this.notes = notes;
      //   console.log(notes)
      //   console.log(this.notes)
      // }); 
    }) 
  
  } 
  

  onNoteClick(note:Note) {
    // set note to complete
    this.noteService.complete(note).subscribe(()=>{
      console.log('completed successfully');
      note.completed = !note.completed;
    });
  }

  onDeleteListClick(){
    this.noteService.deleteList(this.selectedListId).subscribe((res:any)=>{
      this.router.navigate(['/lists'])
      console.log(res)
    })
  }

  onDeleteNoteClick(id: string){
    this.noteService.deleteNote(this.selectedListId, id).subscribe((res:any)=>{
      //this.router.navigate(['/lists'])
      this.notes = this.notes.filter((val: { _id: string; }) => val._id !==id)
      console.log(res)
    })
  }
}
