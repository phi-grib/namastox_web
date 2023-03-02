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

  public graphDefinition = 
     `graph TD;
      A[Problem formulation]-->B[Relevant existing data];
      B-->C{"Is the information\nsufficient?"};
      C--Y-->D[/Risk assesment report/];
      C--N-->E{"Is exposure scenario\nwell-defined?"};
      E---G[...];
      D-->F([Exit]);
  
      style A fill:#548BD4,stroke:#548BD4
      style B fill:#548BD4,stroke:#548BD4
      style C fill:#F2DCDA,stroke:#C32E2D
      style E fill:#F2DCDA,stroke:#C32E2D
      style F fill:#D7E3BF,stroke:#A3B77E
      style G fill:#FFFFFF,stroke:#000000
      
      click A onA
      click B onA
      click C onA
      click D onA
      click E onA
      `;

  flowchartRefresh() {
    const element: any = this.mermaidDiv.nativeElement;
    mermaid.render(
      'graphDiv',
      this.graphDefinition,
      (svgCode, bindFunctions) => {
        element.innerHTML = svgCode;
        bindFunctions(element);
      }
    );
  }

  redirectToTask(){
    $('#pills-results-tab').click();
    $('#pills-pendingtask-tab').click();
  }

  ngAfterViewInit(): void {
    this.flowchartRefresh();
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

