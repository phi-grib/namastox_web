import { Component } from '@angular/core';
import mermaid from 'mermaid';

var exampleCallback = function() {
  alert('A callback was triggered');
}
@Component({
  selector: 'app-navbar-right',
  templateUrl: './navbar-right.component.html',
  styleUrls: ['./navbar-right.component.scss']
})


export class NavbarRightComponent {
  
  private flowChart: any;
  public stringFlowChart: any = "";

    constructor() {
      this.createFlowchart();
    }
    
    ngOnInit(): void {
      mermaid.initialize({	
        startOnLoad: true,
        securityLevel: 'loose'
      });
      setInterval(() => {
        let nodeId = sessionStorage.getItem("ClickedNode");
        if (nodeId) {
          alert('node '+nodeId+' clicked');
           if (nodeId == "a1") {
           }
        }
        sessionStorage.removeItem("ClickedNode");
      });
      
    };

    mycallback (a:string) {
      console.log(a);
    };

    createFlowchart() {
      this.flowChart = [
      "graph TD",
       "id1[Start] --> id2[Ques 1]",
       "id2 --> id3[Ques 2] & id4[Ques 3]",
       "id3 & id4 --> id5[Ques 4]",
       "id5 --> id6",
       "id6[Ques 5] --> id7[End]",
       "id6 --> id2",
       'click id1 call sessionStorage.setItem(ClickedNode,a1)',
       'click id2 call sessionStorage.setItem(ClickedNode,a2)'
      //  'click id1 exampleCallback'
      ];   
      this.stringFlowChart = this.flowChart.join("\n");
     }
  }


