import { Injectable } from '@angular/core';

@Injectable()
export class RA {
  listRA: any[] = [];
  ID: string = '';
  name: string = '';
  general_information: any;
  step: number = 0;
  status: any = '';
  results: any = undefined;
  pending_tasks: any = [];
  workflow: any = undefined;
  notes: any = [];
  note: any = {}
}

export class Results {
  decisions: any[] = [];
  results: any[] = [];
  resultSelected: any;
  decisionSelected: any;
}

export class PendingTasks {
  decisions: any = [];
  results: any = [];
}

@Injectable()
export class Global {
  interfaceVisible: boolean = false;
  editModeTasks: boolean = false;
  editModeDecisions: boolean = false;
}

export class Model {
  name: string;
  version: number;
  documentation: any;
}

@Injectable()
export class User {
  username: string;
  id_token : string;
  status: boolean = false;
}
