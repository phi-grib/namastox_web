import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import mermaid from 'mermaid';

@Component({
  selector: 'app-navbar-right',
  templateUrl: './navbar-right.component.html',
  styleUrls: ['./navbar-right.component.scss']
})

export class NavbarRightComponent implements OnInit, AfterViewInit {
  
  public stringFlowChart: string = `graph TD
  A[Christmas] --> |Get money| B(Go shopping)
  B --> C(Let me think)
  C --> |One| D[Laptop]
  C --> |Two| E[iPhone]
  C --> |Three| F[fa:fa-car Car]
  A[Christmas] --> |Get money| D[Laptop]
  B --> E
  click A call sessionStorage.setItem(ClickedNode,A)
  click B call sessionStorage.setItem(ClickedNode,B)
  `;

  config = {
    startOnLoad: true,
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
    },
    securityLevel: 'loose',
  };

  constructor() {}
  
  ngAfterViewInit(): void {
    mermaid.initialize(this.config);
  }

  ngOnInit(): void {
    // ugly method to pass callback
    setInterval( () => {
      let nodeId = sessionStorage.getItem('ClickedNode');
      if (nodeId) {
        alert('node '+nodeId+' clicked');
        this.stringFlowChart+='E --> F(new one)\n';
        // mermaid.init(undefined, 'E --> F(new one)\n');
        console.log(this.stringFlowChart);
      }
      sessionStorage.removeItem('ClickedNode');
    });
    this.createFlowchart()
    
  };
  
  createFlowchart() {
    this.stringFlowChart = `graph TD
        A[Christmas] --> |Get money| B(Go shopping)
        B --> C(Let me think)
        C --> |One| D[Laptop]
        C --> |Two| E[iPhone]
        C --> |Three| F[fa:fa-car Car]
        A[Christmas] --> |Get money| D[Laptop]
        B --> E
        click A call sessionStorage.setItem(ClickedNode,A)
        click B call sessionStorage.setItem(ClickedNode,B)
        `;
    }
}


