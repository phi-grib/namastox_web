import { Component } from '@angular/core';
import {  Global } from '../globals';
@Component({
  selector: 'app-workflow-options',
  templateUrl: './workflow-options.component.html',
  styleUrl: './workflow-options.component.scss'
})
export class WorkflowOptionsComponent {
  constructor(public global:Global){}



  selectWorkflowMode(mode:boolean){
    this.global.progressTab = mode
  }

}

