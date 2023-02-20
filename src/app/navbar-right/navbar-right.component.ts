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
  templateUrl: './navbar-right.component.html',
  styleUrls: ['./navbar-right.component.scss']
})

export class NavbarRightComponent implements OnInit, AfterViewInit { 
  @ViewChild('mermaidDiv', { static: false }) mermaidDiv: ElementRef;

  public graphDefinition = 
     `graph TD;
      A[DEV]-->C[TRY];
      A-->D[TEST];
      C-->E[LOAD];
      D-->E;
  
      click A onA
      click E onA
      click C onA
      click D onA
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
      },
    });

    mermaid.init();
  }
}

