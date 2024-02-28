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
import { TasksComponent } from './tasks/tasks.component';
import { DecisionsComponent } from './decisions/decisions.component';
import { SelectRaComponent } from './select-ra/select-ra.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ManageRaComponent } from './manage-ra/manage-ra.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { formatDatePipe } from './formatDatePipe';
import { DecisionsFormComponent } from './decisions/decisions-form/decisions-form.component';
import { ModelDocumentationComponent } from './model-documentation/model-documentation.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReportComponent } from './report/report.component';
import { AutolinkPipePipe } from '../app/autolink-pipe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    WorkflowComponent,
    NotesComponent,
    OverviewComponent,
    GeneralInformationComponent,
    TasksComponent,
    DecisionsComponent,
    SelectRaComponent,
    ManageRaComponent,
    TaskFormComponent,
    formatDatePipe,
    DecisionsFormComponent,
    ModelDocumentationComponent,
    NoteFormComponent,
    ReportComponent,
    AutolinkPipePipe
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
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
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
