import { Injectable } from "@angular/core";

@Injectable()
export class RA {
    listRA:any[] = [];
    ID:string = "";
    name: string  = ""; 
    general_information:any;
    step:number = 0;
    status:any = '';
    results:any = undefined;
    pending_tasks:any = [];
    listSteps:any[] = [];
    workflow:any = undefined;
}

export class Results {
    decisions:any[] = []
    results:any[] = [];
    resultSelected:any;
    decisionSelected:any;
}

export class PendingTasks{
    decisions:any = [];
    results:any = [];
}

@Injectable()
export class Global {
    interfaceVisible: boolean  = false;
    editModeTasks: boolean = false;
    editModeDecisions: boolean = false;
}