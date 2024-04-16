import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import mermaid from 'mermaid';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';

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
  @ViewChild('graphDiv', { static: false }) graphDiv: ElementRef;

    
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
  /**
   * Image format export
   */
  exportWorkflow(){ 
    this.guardarImagen();
    }
    guardarImagen() {
      // Obtiene el elemento SVG
      const svgElement = document.getElementById('graphDiv');
    
      // Crea un canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // Obtiene las dimensiones del SVG
      const svgBounds = svgElement.getBoundingClientRect();
      // Establece el tamaño del canvas para que coincida con las dimensiones del SVG
    canvas.width = 500;
    canvas.height = 500;

      // Crea una nueva imagen SVG
      const xml = new XMLSerializer().serializeToString(svgElement);
      const svg64 = btoa(xml);
      const image64 = 'data:image/svg+xml;base64,' + svg64;
    
      // Carga la imagen SVG en un objeto de imagen
      const img = new Image();
      img.onload = () => {
        // Dibuja la imagen SVG en el canvas
        context.drawImage(img, 0, 0);
    
        // Convierte el canvas en una URL de datos de imagen
        const imgData = canvas.toDataURL('image/png');
    
        // Crea un enlace temporal para descargar la imagen
        const link = document.createElement('a');
        link.setAttribute('download', 'screenshot.png');
        link.setAttribute('href', imgData);
        link.click();
      };
      img.src = image64;
    }
  };
