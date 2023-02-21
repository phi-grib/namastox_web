import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import mermaid from 'mermaid';
@Component({
  selector: 'app-navbar-right',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})

export class WorkflowComponent implements OnInit, AfterViewInit { 
  @ViewChild('mermaidDiv', { static: false }) mermaidDiv: ElementRef;

  public graphDefinition = 
     `graph TD;
      A[Problem formulation]-->B[Relevant existing data];
      B-->C{"Is the information\n sufficient?"};
      C--Y-->D[/Risk assesment report/];
      C--N-->E{"Is exposure scenario\n well-defined?"};
      D-->F([Exit]);
  
      style A fill:#548BD4,stroke:#548BD4
      style B fill:#548BD4,stroke:#548BD4
      style C fill:#F2DCDA,stroke:#C32E2D
      style E fill:#F2DCDA,stroke:#C32E2D
      style F fill:#D7E3BF,stroke:#A3B77E
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

  ngAfterViewInit(): void {
    this.flowchartRefresh();
  }

  ngOnInit(): void {
    (window as any).onA = (nodeName) => {
      this.graphDefinition += 'E-->F[NEW ELEMENT]\n';
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

