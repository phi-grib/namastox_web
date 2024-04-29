import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import mermaid from 'mermaid';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';
import { toBase64 } from 'js-base64';
type Exporter = (context: CanvasRenderingContext2D, image: HTMLImageElement) => () => void;


@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent implements OnInit {
  constructor(
    public ra: RA,
    private commonService: CommonService,
    private pendingTasks: PendingTasks,
    private results: Results
  ) {}
  @ViewChild('mermaidDiv', { static: false }) mermaidDiv: ElementRef;

  flowchartRefresh() {
    const element: any = this.mermaidDiv.nativeElement;
    mermaid.render('graphDiv', this.ra.workflow, (svgCode, bindFunctions) => {
      element.innerHTML = svgCode;
      bindFunctions(element);
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

  ngOnInit(): void {
    (window as any).onA = (nodeName) => {
      this.checkType(nodeName);
    };

    /**
     * Export workflow image format
     */

    mermaid.initialize({
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      //  curve: 'stepAfter',
      },
    });

    mermaid.init();

    this.commonService.refreshWorklfow$.subscribe(() => {
      this.flowchartRefresh();
    });
  }


   simulateDownload(download: string, href: string): void  {
    const a = document.createElement('a');
    a.download = download;
    a.href = href;
    a.click();
    a.remove();
  };

   downloadImage: Exporter = (context, image) => {
    return () => {
      const { canvas } = context;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      this.simulateDownload(
        `mermaid-diagram_${this.ra.name}.png`,
        canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      );
    };
  };
  

   onDownloadPNG (event?: Event)  {
    console.log("aqui")
    this.exportImage(event, this.downloadImage);
  };

   getSvgElement () {
    const svgElement = document.getElementById('graphDiv')?.cloneNode(true) as HTMLElement;
    svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    const styleElement = document.createElement('style');
    styleElement.textContent = `@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css");'`;
    svgElement.prepend(styleElement);
    return svgElement;
  };


   getBase64SVG = (svg?: HTMLElement, width?: number, height?: number): string => {
    if (svg) {
      // Prevents the SVG size of the interface from being changed
      svg = svg.cloneNode(true) as HTMLElement;
    }
    height && svg?.setAttribute('height', `${height}px`);
    width && svg?.setAttribute('width', `${width}px`); // Workaround https://stackoverflow.com/questions/28690643/firefox-error-rendering-an-svg-image-to-html5-canvas-with-drawimage
    if (!svg) {
      svg = this.getSvgElement();
    }
    const svgString = svg.outerHTML
      .replaceAll('<br>', '<br/>')
      .replaceAll(/<img([^>]*)>/g, (m, g: string) => `<img ${g} />`);
    return toBase64(svgString);
  };


   exportImage(event: Event, exporter: Exporter)  {
    if (document.querySelector('.outOfSync')) {
      throw new Error('Diagram is out of sync');
    }
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const svg = document.getElementById('graphDiv');
    if (!svg) {
      throw new Error('svg not found');
    }
    const box: DOMRect = svg.getBoundingClientRect();
    canvas.width = box.width;
    canvas.height = box.height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('context not found');
    }
    context.fillStyle = `hsl(${window.getComputedStyle(document.body).getPropertyValue('--b1')})`;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const image = new Image();
    image.addEventListener('load', exporter(context, image));
    image.src = `data:image/svg+xml;base64,${this.getBase64SVG(svg, canvas.width, canvas.height)}`;

    event.stopPropagation();
    event.preventDefault();
  };






}
