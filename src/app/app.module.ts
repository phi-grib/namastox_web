import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MarkdownModule, MARKED_OPTIONS, MarkedRenderer,MarkedOptions } from 'ngx-markdown';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { AngularSplitModule } from 'angular-split';
import { AppComponent } from './app.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { NotesComponent } from './notes/notes.component';
import { RA,Global, PendingTasks, Results,User, Method } from './globals';
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
import { ReportComponent } from './report/report.component';
import { AutolinkPipePipe } from '../app/autolink-pipe.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPanZoomModule } from 'ngx-panzoom';
import { CookieService } from 'ngx-cookie-service';
import { FilterVersionPipe } from './filter-version.pipe';
import { TruncateDecimalsPipe } from './truncate-decimals.pipe';
import { UserInfoComponent } from './user-info/user-info.component';
import { WorkflowOptionsComponent } from './workflow-options/workflow-options.component';
import { WorkflowFullViewComponent } from './workflow-full-view/workflow-full-view.component';
import { AboutSoftwareComponent } from './about-software/about-software.component';
import { LogosComponent } from './logos/logos.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkflowComponent,
    WorkflowOptionsComponent,
    NotesComponent,
    WorkflowFullViewComponent,
    OverviewComponent,
    GeneralInformationComponent,
    TasksComponent,
    UserInfoComponent,
    AboutSoftwareComponent,
    LogosComponent,
    DecisionsComponent,
    SelectRaComponent,
    ManageRaComponent,
    TaskFormComponent,
    formatDatePipe,
    DecisionsFormComponent,
    ModelDocumentationComponent,
    NoteFormComponent,
    ReportComponent,
    AutolinkPipePipe,
    FilterVersionPipe,
    TruncateDecimalsPipe
  ],
  imports: [
    NgbModule,
    BrowserModule,
    DataTablesModule,
    AngularSplitModule,
    HttpClientModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPanZoomModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MarkdownModule.forRoot({
      loader: HttpClient,  // solo si usas [src]
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory
      },
    }),
  ],
  providers: [CookieService,RA,Global,PendingTasks,Results,User,Method],
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
  };
}
