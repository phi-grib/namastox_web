import {
  Component,
  ViewChild,
  ElementRef,
  OnInit
} from '@angular/core';
import mermaid from 'mermaid';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';
@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})

export class WorkflowComponent implements OnInit {

  constructor(public ra: RA, private commonService: CommonService, private pendingTasks: PendingTasks, private results: Results) {

  }
  @ViewChild('mermaidDiv', { static: false }) mermaidDiv: ElementRef;


  flowchartRefresh() {
    const element: any = this.mermaidDiv.nativeElement;
    mermaid.render(
      'graphDiv',
      this.ra.workflow,
      (svgCode, bindFunctions) => {
        element.innerHTML = svgCode;
        bindFunctions(element);
      }
    );
  }


  selectTableRowByValue(tableID: string, column: number, value: string) {
    const table = document.querySelector(tableID);
    table.querySelectorAll('tr').forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells[column] != undefined && cells[column].textContent === value) {
        row.click();
      }
    });
  }
  selectOptionBytaskID(selectorID,taskID){
    const selector = document.getElementById(selectorID);
       selector.querySelectorAll('option').forEach((option)=> {
          if(option.textContent === taskID){
            option.selected = true;
            this.commonService.AutoGenerateForm(taskID);
          } 
       })
  }
  selectTask(typeTask,taskID){
    const selectorID = typeTask === 'results' ?'selectPendingResult' :'#selectPendingDecision';
    this.selectOptionBytaskID(selectorID,taskID);
  }
  selectPastTask(typeTask, taskName) {
    const tableID = typeTask === 'results' ? '#dtTasks' : '#dtDecisions';
    this.selectTableRowByValue(tableID, 0, taskName);
  }

  redirectToTask(typeTask, pending, taskname) {
    if (typeTask == 'results') {
      $('#pills-tasks-tab').click();
      if (pending) {
        $('#pills-pendingtask-tab').click();
        this.selectTask(typeTask,taskname);
      } else {
        $('#pills-pasttasks-tab').click();
        this.selectPastTask(typeTask, taskname)
      }
    } else {
      $('#pills-decisions-tab').click();
      if (pending) {
        $('#pills-pendingdecisions-tab').click();
        // this.selectTask(typeTask,taskname);
      } else {
        $('#pills-pastdecisions-tab').click();
        this.selectPastTask(typeTask, taskname)
      }
    }
  }

  checkType(taskName) {
    // RESULTS
    const pendingTaskResults = this.pendingTasks.results.find(task => task.id == taskName)
    const pastTaskResults = this.results.results.find(task => task.id == taskName)
    if (pendingTaskResults) this.redirectToTask('results', true, taskName)
    if (pastTaskResults) this.redirectToTask('results', false, taskName)
    // DECISIONS
    const pendingTaskDecisions = this.pendingTasks.decisions.find(task => task.id == taskName)
    const pastTaskDecisions = this.results.decisions.find(task => task.id == taskName)
    if (pendingTaskDecisions) this.redirectToTask('decisions', true, taskName)
    if (pastTaskDecisions) this.redirectToTask('decisions', false, taskName)

  }

  ngOnInit(): void {
    (window as any).onA = (nodeName) => {
      this.checkType(nodeName);
    };

    mermaid.initialize({
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'stepAfter'
      },
    });

    mermaid.init();

    this.commonService.refreshWorklfow$.subscribe(() => {
      this.flowchartRefresh();
    })
  }
}

