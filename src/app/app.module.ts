import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { AngularSplitModule } from 'angular-split';
import { AppComponent } from './app.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { NotesComponent } from './notes/notes.component';
import { RA,Global, PendingTasks, Results } from './globals';
import { OverviewComponent } from './overview/overview.component';
import { GeneralInformationComponent } from './general-information/general-information.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldFile } from './general-information/file-type.component';
import { FileValueAccessor } from './general-information/file-value-accessor';
import { ResultsComponent } from './results/results.component';
import { DecisionsComponent } from './decisions/decisions.component';
import { SelectRaComponent } from './select-ra/select-ra.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    WorkflowComponent,
    NotesComponent,
    OverviewComponent,
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
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormlyModule.forRoot(
      {
        types: [{ name: 'file', component: FormlyFieldFile, wrappers: ['form-field'] }],
      }
    ),
    FormlyBootstrapModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory,
      },
    })
  ],
  providers: [RA,Global,PendingTasks,Results],
  bootstrap: [AppComponent]
})
export class AppModule { }

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  renderer.code = function (code, language) {
    if (language.match(/^mermaid/)) {
      return '<div class="mermaid">' + code + '</div>';
    } else {
      return '<pre><code>' + code + '</code></pre>';
    }
  };
  return {
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}
