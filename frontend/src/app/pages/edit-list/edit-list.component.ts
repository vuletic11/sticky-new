import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NoteService } from 'src/app/note.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {

  constructor(private route:ActivatedRoute, private noteService:NoteService, private router:Router) { }

  listId:string;  

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.listId = params['listId'];
      
      })

    }
  

  updateList(title: string){
    this.noteService.updateList(this.listId, title).subscribe(()=>{
      this.router.navigate(['/lists', this.listId])
    })
  }

}
