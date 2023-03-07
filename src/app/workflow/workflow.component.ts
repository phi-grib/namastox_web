import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import mermaid from 'mermaid';
import { RA } from '../globals';
@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})

export class WorkflowComponent implements OnInit, AfterViewInit { 

  constructor(private ra: RA){

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

  redirectToTask(){
    var task = 'result'
    if(task == 'result'){
      $('#pills-results-tab').click();
      $('#pills-pendingtask-tab').click();
    }else{
      $('#pills-decisions-tab').click();
      $('#pills-pendingdecisions-tab').click();
    }

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if(this.ra.listRA.length > 0 ){
            this.flowchartRefresh();
      }
    }, 300);
  }

  ngOnInit(): void {
    (window as any).onA = (nodeName) => {
      if(nodeName === 'A' && this.ra.status.step == 1){
        this.redirectToTask();
      }
      this.flowchartRefresh();
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
  }
}

