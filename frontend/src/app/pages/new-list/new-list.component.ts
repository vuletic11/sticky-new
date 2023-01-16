import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/note.service';
import { Router } from '@angular/router';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {

  constructor(private noteService: NoteService, private router: Router) { }

 

  ngOnInit() {
  }

createList(title:string){
  this.noteService.createList(title).subscribe((list:any)=>{
    console.log(list);
    //navigate to /lists/response._id
    
    this.router.navigate(['/lists', list._id]);
  })
}

}

