import { AfterViewInit,Component, ViewChild,ElementRef,Renderer2 } from '@angular/core';
import mermaid from 'mermaid';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';
import { PanZoomConfig, PanZoomAPI } from 'ngx-panzoom';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-workflow-full-view',
  templateUrl: './workflow-full-view.component.html',
  styleUrl: './workflow-full-view.component.scss'
})
export class WorkflowFullViewComponent implements AfterViewInit {
  panZoomConfig: PanZoomConfig = new PanZoomConfig(
    {freeMouseWheelFactor:0.001,zoomOnDoubleClick:false,dynamicContentDimensions:true,zoomLevels: 50,initialZoomLevel:3  }
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

 @ViewChild('mermaidDivFullView', { static: false }) mermaidDiv: ElementRef;

 async flowchartRefresh() {
  const container = this.mermaidDiv.nativeElement as HTMLElement;
  const { svg } = await mermaid.render('graphDivFullView', this.ra.workflow_full_view);
  container.innerHTML = svg;
  this.panZoomAPI.resetView();
}

ngAfterViewInit(): void {
  this.apiSubscription = this.panZoomConfig.api.subscribe(
    (api) => (this.panZoomAPI = api)
  );

  mermaid.initialize({
    startOnLoad: true,
    securityLevel: 'loose',
    flowchart: {
       
      useMaxWidth: true,
      htmlLabels: true
    },
    gantt: {
      useMaxWidth: true,
      },
  });
  this.commonService.refreshWorklfow$.subscribe(() => {
    this.flowchartRefresh();
  });
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

}
