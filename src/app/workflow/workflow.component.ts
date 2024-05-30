import { AfterViewInit,Component, ViewChild,ElementRef,Renderer2 } from '@angular/core';
import mermaid from 'mermaid';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';
import { PanZoomConfig, PanZoomAPI } from 'ngx-panzoom';
import { Subscription } from 'rxjs';
// import { toPng } from 'html-to-image';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent implements AfterViewInit {
  panZoomConfig: PanZoomConfig = new PanZoomConfig(
     {freeMouseWheelFactor:0.001,zoomOnDoubleClick:false,dynamicContentDimensions:true}
  );
	private panZoomAPI: PanZoomAPI;
	private apiSubscription: Subscription;
  constructor(
    public ra: RA,
    private commonService: CommonService,
    private pendingTasks: PendingTasks,
    private results: Results,
    private elementRef:ElementRef,
    private renderer:Renderer2
  ) {}
  @ViewChild('mermaidDiv', { static: false }) mermaidDiv: ElementRef;

  flowchartRefresh() {
    const element: any = this.mermaidDiv.nativeElement;
    mermaid.render('graphDiv', this.ra.workflow, (svgCode, bindFunctions) => {
      element.innerHTML = svgCode;
      bindFunctions(element);
      if(this.ra.status.step >= 3){
        const svgElement = this.elementRef.nativeElement.querySelector('#graphDiv');
        this.renderer.removeAttribute(svgElement,'style');
        this.renderer.setAttribute(svgElement,'width','730px');
      }
    });
  }
  selectTableRowByValue(tableID: string, column: number, value: string) {
    //first check if accordion is opened
    const accTask = document.getElementById('pastCollapseTasks');
    const accSelectTask = document.getElementById('tableCollapseTasks');
    if (accSelectTask.classList.contains('collapsed')) {
      accSelectTask.click();
    }
    setTimeout(() => {
      const table = document.querySelector(tableID);
      table.querySelectorAll('tr').forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells[column] != undefined && cells[column].textContent === value) {
          row.click();
          setTimeout(() => {
            if (accTask.classList.contains('collapsed')) {
              accTask.click();
            }
          }, 300);
        }
      });
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
    taskLabel = this.results[typeTask].find(task => task.id == taskLabel)
    taskLabel = taskLabel.label
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
    const pendingTaskResults = this.pendingTasks.results.find(
      (task) => task.id == taskName
    );
    const pastTaskResults = this.results.results.find(
      (task) => task.id == taskName
    );
    if (pendingTaskResults) this.redirectToTask('results', true, taskName);
    if (pastTaskResults) this.redirectToTask('results', false, taskName);
    // DECISIONS
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
			(api: PanZoomAPI) => (this.panZoomAPI = api)
		);
    (window as any).onA = (nodeName) => {
        this.checkType(nodeName);
    };
    mermaid.initialize({
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      //  curve: 'stepAfter',
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