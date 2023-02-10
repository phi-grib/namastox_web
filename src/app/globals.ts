import { Injectable } from "@angular/core";

@Injectable()
export class RA {
    ID:string = "";
    name: string  = ""; 
    general_information:any;
    step:number = 0;
    workflow_name:string = "";
    status:any  = undefined;
    results:any = undefined;
    pending_tasks:any = [];
}

@Injectable()
export class Global {
    interfaceVisible: boolean  = false;
}