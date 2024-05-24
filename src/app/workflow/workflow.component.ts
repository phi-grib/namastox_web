import { AfterViewInit,Component, ViewChild,ElementRef,Renderer2 } from '@angular/core';
import mermaid from 'mermaid';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';
import { Subscription } from 'rxjs';
import * as d3 from "d3";
@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent implements AfterViewInit {
	private apiSubscription: Subscription;
  constructor(
    public ra: RA,
    private commonService: CommonService,
    private pendingTasks: PendingTasks,
    private results: Results,
    private elementRef:ElementRef,
    private renderer:Renderer2
  ) {}
  @ViewChild('mermaidDiv', { static: false }) mermaidDiv: ElementRef;

  flowchartRefresh() {
    const element: any = this.mermaidDiv.nativeElement;
    mermaid.render('graphDiv', this.ra.workflow, (svgCode, bindFunctions) => {
      element.innerHTML = svgCode;
      bindFunctions(element);
      this.addZoomAndPan(element.querySelector('svg'));
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
  addZoomAndPan(svgElement: SVGSVGElement) {
    const svg = d3.select(svgElement);
    const g = svg.select("g");

    const zoom = d3.zoom().on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

    svg.call(zoom);
  }
  ngAfterViewInit(): void {
    const svg = d3.select("graphDiv");
    const zoomFn = d3.zoom().on('zoom', (event) => {
      svg.attr("transform", event.transform);
    });
    svg.call(zoomFn);
    let onAExecuted = false;
    (window as any).onA = (nodeName) => {
      if (!onAExecuted) {
        this.checkType(nodeName);
        onAExecuted = true;
      } else {
        onAExecuted = false;
      }
    };
    mermaid.initialize({
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      //  curve: 'stepAfter',
      },
    });

    this.commonService.refreshWorklfow$.subscribe(() => {
      this.flowchartRefresh();

    });
  }

  downloadWorkflow ()  {
 // Obtener el elemento SVG
 const svgElement = document.getElementById('graphDiv');

 // Serializar el contenido del SVG como una cadena
 const svgString = new XMLSerializer().serializeToString(svgElement);

 // Crear un elemento de imagen con el contenido del SVG como fuente
 const img = new Image();
 img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;

 // Esperar a que la imagen se cargue
 img.onload = () => {
   // Crear un canvas
   const canvas = document.createElement('canvas');
   canvas.width = img.width;
   canvas.height = img.height;
   const ctx = canvas.getContext('2d');

   // Renderizar la imagen en el canvas
   ctx.drawImage(img, 0, 0,40,80);

   // Obtener la URL de la imagen en formato PNG
   const dataURL = canvas.toDataURL('image/png','image/octet-stream');

   // Crear un enlace de descarga para descargar la imagen
   const link = document.createElement('a');
   link.download = 'imagen.png';
   link.href = dataURL;
   link.click();
 };
}
}
