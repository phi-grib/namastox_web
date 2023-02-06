import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularSplitModule } from 'angular-split';
import { AppComponent } from './app.component';
import { NavbarLeftComponent } from './navbar-left/navbar-left.component';
import { NavbarRightComponent } from './navbar-right/navbar-right.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarLeftComponent,
    NavbarRightComponent
  ],
  imports: [
    BrowserModule,
    AngularSplitModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
