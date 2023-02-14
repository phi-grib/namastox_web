import { Injectable } from "@angular/core";

@Injectable()
export class RA {
    listRA:any[] = [];
    ID:string = "";
    name: string  = ""; 
    general_information:any;
    step:number = 0;
    workflow_name:string = "";
    status:any  = undefined;
    results:any = undefined;
    pending_tasks:any = [];
    listSteps:any[] = [];
}

export class Results {
    decisions:any[] = []
    results:any[] = [];
}

export class PendingTasks{
    decisions:any = [];
    results:any = [];
}

@Injectable()
export class Global {
    interfaceVisible: boolean  = false;
}