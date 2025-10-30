import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import mermaid from 'mermaid';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';
import { PanZoomConfig, PanZoomAPI } from 'ngx-panzoom';
import { Subscription } from 'rxjs';
// import { toPng } from 'html-to-image';

@Component({
  selector: 'app-workflow-progress',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent implements AfterViewInit {
  panZoomConfig: PanZoomConfig = new PanZoomConfig({
    freeMouseWheelFactor: 0.001,
    zoomOnDoubleClick: false,
    dynamicContentDimensions: true,
    initialZoomLevel: 3,
    zoomLevels: 50,
  });
  private panZoomAPI: PanZoomAPI;
  private apiSubscription: Subscription;
  constructor(
    public ra: RA,
    private commonService: CommonService,
    private pendingTasks: PendingTasks,
    private results: Results,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}
  @ViewChild('mermaidDiv', { static: false }) mermaidDiv: ElementRef;

  async flowchartRefresh() {
    const container = this.mermaidDiv.nativeElement as HTMLElement;
    const { svg } = await mermaid.render('graphDiv', this.ra.workflow);
    container.innerHTML = svg;
    this.panZoomAPI.resetView();
    container.querySelectorAll<SVGGElement>('.node').forEach((node) => {
      node.addEventListener('click', () => {
        const match = node.id.match(/-(.*?)-/);
        this.checkType(match?.[1] ?? '');
      });
    });
  }

  getElementsByTableID = (tableID) => {
    const elements: any = {
      btnTask: document.querySelector('#pastCollapseTasks'),
      btnSelectTask: document.querySelector('#tableCollapseTasks'),
      accordionbodySelector: document.querySelector('#flush-collapseOneTasks'),
      accordionbodyTask: document.querySelector('#flush-collapseTwoTasks'),
    };

    if (tableID === '#dtDecisions') {
      elements.btnTask = document.querySelector('#pastCollapseDecisions');
      elements.btnSelectTask = document.querySelector(
        '#tableCollapseDecisions'
      );
      elements.accordionbodySelector = document.querySelector(
        '#flush-collapseOneDecisions'
      );
      elements.accordionbodyTask = document.querySelector(
        '#flush-collapseTwoDecisions'
      );
    }

    return elements;
  };

  selectTableRowByValue(tableID: string, column: number, value: string) {
    const { btnTask, btnSelectTask, accordionbodySelector, accordionbodyTask } =
      this.getElementsByTableID(tableID);

    if (accordionbodySelector.classList.contains('collapse')) {
      btnSelectTask.click();
    }

    setTimeout(() => {
      var idxPage = 0;
      $(tableID).DataTable().page(idxPage).draw('page'); // start search in page 1
      const table = document.querySelector(tableID);
      var found = undefined;
      while (found != true) {
        table.querySelectorAll('tr').forEach((row) => {
          const cells = row.querySelectorAll('td');
          if (
            cells[column] != undefined &&
            cells[column].textContent === value
          ) {
            row.click();
            found = true;
            setTimeout(() => {
              if (accordionbodyTask.classList.contains('collapse')) {
                btnTask.click();
              }
            }, 100);
          }
        });
        // if not found , pass next page of table 
        if (found != true) {
          idxPage += 1;
          $(tableID).DataTable().page(idxPage).draw('page');
        }
      }
    }, 300);
  }

  selectOptionBytaskID(selectorID, taskID) {
    const selector = document.getElementById(selectorID);
    selector.querySelectorAll('option').forEach((option) => {
      if (option.value.trim() === taskID) {
        option.selected = true;
        this.commonService.AutoGenerateForm(taskID);
      }
    });
  }
  selectTask(typeTask, taskID) {
    const selectorID =
      typeTask === 'results' ? 'selectPendingResult' : 'selectPendingDecision';
    this.selectOptionBytaskID(selectorID, taskID);
  }
  selectPastTask(typeTask, taskLabel) {
    taskLabel = this.results[typeTask].find((task) => task.id == taskLabel);
    taskLabel = taskLabel.label;
    const tableID = typeTask === 'results' ? '#dtTasks' : '#dtDecisions';
    this.selectTableRowByValue(tableID, 1, taskLabel);
  }

  redirectToTask(typeTask, pending, taskname) {
    if (typeTask == 'results') {
      $('#pills-tasks-tab').click();
      if (pending) {
        $('#pills-pendingtask-tab').click();
        this.selectTask(typeTask, taskname);
      } else {
        $('#pills-pasttasks-tab').click();
        this.selectPastTask(typeTask, taskname);
      }
    } else {
      $('#pills-decisions-tab').click();
      if (pending) {
        $('#pills-pendingdecisions-tab').click();
        this.selectTask(typeTask, taskname);
      } else {
        $('#pills-pastdecisions-tab').click();
        this.selectPastTask(typeTask, taskname);
      }
    }
  }

  checkType(taskName) {
    // RESULTS
    // check if task is pending or past
    const pendingTaskResults = this.pendingTasks.results.find(
      (task) => task.id == taskName
    );
    const pastTaskResults = this.results.results.find(
      (task) => task.id == taskName
    );

    if (pastTaskResults) this.redirectToTask('results', false, taskName);
    // or
    if (pendingTaskResults) this.redirectToTask('results', true, taskName);

    // DECISIONS
    // check if decision is pending or past
    const pendingTaskDecisions = this.pendingTasks.decisions.find(
      (task) => task.id == taskName
    );
    const pastTaskDecisions = this.results.decisions.find(
      (task) => task.id == taskName
    );
    if (pendingTaskDecisions) this.redirectToTask('decisions', true, taskName);

    if (pastTaskDecisions) this.redirectToTask('decisions', false, taskName);
  }

  zoomIn() {
    this.panZoomAPI.zoomIn();
  }

  zoomOut() {
    this.panZoomAPI.zoomOut();
  }

  reset() {
    this.panZoomAPI.resetView();
  }
  ngAfterViewInit(): void {
    this.apiSubscription = this.panZoomConfig.api.subscribe(
      (api) => (this.panZoomAPI = api)
    );

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      },
    });
    this.commonService.refreshWorklfow$.subscribe(() => {
      this.flowchartRefresh();
    });
  }

  // downloadWorkflow() {
  //   toPng(document.getElementById('graphDiv'))
  //     .then((dataUrl) => {
  //       this.downloadFile(dataUrl, 'image/png', 'imagen.png');
  //     });
  // }

  downloadFile(dataUrl: string, type: string, filename: string) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.type = type;
    link.click();
  }
}
