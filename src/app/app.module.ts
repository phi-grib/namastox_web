import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularSplitModule } from 'angular-split';
import { AppComponent } from './app.component';
import { NavbarLeftComponent } from './navbar-left/navbar-left.component';
import { NavbarRightComponent } from './navbar-right/navbar-right.component';
import { NotesComponent } from './notes/notes.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarLeftComponent,
    NavbarRightComponent,
    NotesComponent
  ],
  imports: [
    BrowserModule,
    AngularSplitModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
