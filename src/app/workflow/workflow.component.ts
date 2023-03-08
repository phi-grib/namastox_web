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

  constructor(private ra: RA,private commonService:CommonService,private pendingTasks:PendingTasks,private results:Results){

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

  selectPastTask(typeTask,taskName){
    let tableID = typeTask === 'results' ? '#dtResults' : '#dtDecisions'
    const table = document.querySelector(tableID);
    table.querySelectorAll('tr').forEach((row) => {
      const cells = row.querySelectorAll('td');
      if(cells[0] != undefined && cells[0].textContent === taskName){
        row.click();
      }
    });
  }

  redirectToTask(typeTask,pending,taskname){
    if(typeTask == 'results'){
      $('#pills-results-tab').click();
      if(pending){
        $('#pills-pendingtask-tab').click();
        // TO DO
        // console.log(this.pendingTasks.results)
        // let selector:any = document.getElementById("selectPendingResult");
        // const option = selector.options[1]
        // option.click();
      }else{
        $('#pills-pasttasks-tab').click();  
        this.selectPastTask(typeTask,taskname)
      }
    }else{
      $('#pills-decisions-tab').click();
      if(pending){
        $('#pills-pendingdecisions-tab').click();
      }else{
        $('#pills-pastdecisions-tab').click();
        this.selectPastTask(typeTask,taskname)
      }
    }
  }

  checkType(taskName){
    // RESULTS
    const pendingTaskResults = this.pendingTasks.results.find(task => task.id == taskName)
    const pastTaskResults = this.results.results.find(task => task.id == taskName)
    if(pendingTaskResults) this.redirectToTask('results',true,taskName) 
    if(pastTaskResults) this.redirectToTask('results',false,taskName)
    // DECISIONS
    const pendingTaskDecisions = this.pendingTasks.decisions.find(task => task.id == taskName)
    const pastTaskDecisions = this.results.decisions.find(task => task.id == taskName)
    if(pendingTaskDecisions) this.redirectToTask('decisions',true,taskName) 
    if(pastTaskDecisions) this.redirectToTask('decisions',false,taskName)

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

    this.commonService.refreshWorklfow$.subscribe(()=>{
      this.flowchartRefresh();
    })
  }
}

