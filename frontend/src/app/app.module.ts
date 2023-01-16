import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoteViewComponent } from './pages/note-view/note-view.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewNoteComponent } from './pages/new-note/new-note.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { WebReqInterceptor } from './web-req.interceptor';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditNoteComponent } from './pages/edit-note/edit-note.component';


@NgModule({
  declarations: [
    AppComponent,
    NoteViewComponent,
    NewListComponent,
    NewNoteComponent,
    LoginPageComponent,
    SignupPageComponent,
    EditListComponent,
    EditNoteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass : WebReqInterceptor, multi : true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
