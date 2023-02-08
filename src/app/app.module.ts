import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { AngularSplitModule } from 'angular-split';
import { AppComponent } from './app.component';
import { NavbarLeftComponent } from './navbar-left/navbar-left.component';
import { NavbarRightComponent } from './navbar-right/navbar-right.component';
import { NotesComponent } from './notes/notes.component';
import { SelectorRaComponent } from './selector-ra/selector-ra.component';
import { OptionsRasComponent } from './options-ras/options-ras.component';
import { RA,Global } from './globals';
import { OverviewComponent } from './overview/overview.component';
import { GeneralInfomrationComponent } from './general-infomration/general-infomration.component';
import { GeneralInformationComponent } from './general-information/general-information.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarLeftComponent,
    NavbarRightComponent,
    NotesComponent,
    SelectorRaComponent,
    OptionsRasComponent,
    OverviewComponent,
    GeneralInfomrationComponent,
    GeneralInformationComponent
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    AngularSplitModule,
    HttpClientModule
  ],
  providers: [RA,Global],
  bootstrap: [AppComponent]
})
export class AppModule { }
