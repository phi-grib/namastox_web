import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { AngularSplitModule } from 'angular-split';
import { AppComponent } from './app.component';
import { NavbarLeftComponent } from './navbar-left/navbar-left.component';
import { NavbarRightComponent } from './navbar-right/navbar-right.component';
import { NotesComponent } from './notes/notes.component';
import { SelectorRaComponent } from './selector-ra/selector-ra.component';
import { OptionsRasComponent } from './options-ras/options-ras.component';
import { RA,Global, PendingTasks } from './globals';
import { OverviewComponent } from './overview/overview.component';
import { GeneralInfomrationComponent } from './general-infomration/general-infomration.component';
import { GeneralInformationComponent } from './general-information/general-information.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldFile } from './general-information/file-type.component';
import { FileValueAccessor } from './general-information/file-value-accessor';
import { ResultsComponent } from './results/results.component';
import { DecisionsComponent } from './decisions/decisions.component';
import { SelectRaComponent } from './select-ra/select-ra.component';
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
    GeneralInformationComponent,
    FileValueAccessor,
    FormlyFieldFile,
    ResultsComponent,
    DecisionsComponent,
    SelectRaComponent
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    AngularSplitModule,
    HttpClientModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    FormsModule,
    FormlyModule.forRoot(
      {
        types: [{ name: 'file', component: FormlyFieldFile, wrappers: ['form-field'] }],
      }
    ),
    FormlyBootstrapModule
  ],
  providers: [RA,Global,PendingTasks],
  bootstrap: [AppComponent]
})
export class AppModule { }
