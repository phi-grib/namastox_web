import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject,Subject } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private http: HttpClient) {}

  private generateForms = new Subject<String>();
  generateForms$ = this.generateForms.asObservable();
  AutoGenerateForm(taskID?: string){
    this.generateForms.next(taskID)
  }
  /* update workflow */
  private refreshWorkflow = new Subject<boolean>();
  refreshWorklfow$ = this.refreshWorkflow.asObservable();
  updateWorkflow(){
    this.refreshWorkflow.next(true);
  }
  /* update canvas in Overview */
  private updateOverviewCanvas = new BehaviorSubject<boolean>(false);
  updateOverviewCanvas$ = this.updateOverviewCanvas.asObservable();
  drawOverviewCanvas(status:boolean){
    this.updateOverviewCanvas.next(status);
  }
  /**Get list of RAs */
  getRaList(){
    const url: string = environment.baseUrl + "list";
    return this.http.get(url)
  }
  /**Get steps of ra */
  getSteps(ra_name:string){
    const url: string = environment.baseUrl + "steps/"+ra_name;
    return this.http.get(url)
  }
  /**Get General Information RA */
  getGeneralInfo(ra_name:string){
  const url: string = environment.baseUrl + "general_info/"+ra_name
  return this.http.get(url)
  }
  /**Get Status of RA */
  getStatus(ra_name:string){
    const url: string = environment.baseUrl + "status/"+ra_name;
    /**change any type to correct interface, good practice  */
    return this.http.get<any>(url)
  }
  /**Get status with  specific step of RA */
  getStatusWithStep(ra_name:string,step:number){
    const url: string = environment.baseUrl + "status/"+ra_name+"/"+step;
    return this.http.get<any>(url)
    
  }
  /**get results */
  getResults(ra_name:string){
    const url: string = environment.baseUrl + "results/"+ra_name;
    return this.http.get(url)

  }
  
  /**get task */
  getTask(ra_name:string,id:string){
    const url: string = environment.baseUrl + "task/"+ra_name+"/"+id;
    return this.http.get(url)
  }

  /**get results with specific step of RA */
  getResultsWithStep(ra_name:string,step:number){
    const url: string = environment.baseUrl + "results/"+ra_name+"/"+step;
    return this.http.get(url)
  }
  getWorkflowByStep(ra_name:string,step:number){
    const url: string = environment.baseUrl + "workflow/"+ra_name+"/"+step;
    return this.http.get(url)
  }
  /** get Pending tasks */
  getPendingTasks(ra_name:string){
    const url: string = environment.baseUrl + "pending_tasks/"+ra_name;
    return this.http.get(url)
  }
  /**get pending task */
  getPendingTask(ra_name:string,id:String){
    const url: string = environment.baseUrl + "pending_task/"+ra_name+"/"+id;
    return this.http.get(url)
  }
  getLink(ra_name:string,file_name:string){
    const url: string = environment.baseUrl + "link/"+ra_name+"/"+file_name;
    return this.http.get(url,{ responseType: 'blob' })
  }

  getWorkflow(ra_name:string){
    const url: string = environment.baseUrl + "workflow/"+ra_name;
    return this.http.get(url)
  }

  getPrediction(ra_name:string,names,versions){
    const formData = new FormData();
     formData.append("models",names)
     formData.append("versions",versions)
    const url: string = environment.baseUrl + 'predict/'+ra_name;
    return this.http.put(url,formData)
  }

  getModels(){
    const url: string = environment.baseUrl + "models";
    return this.http.get(url)
  }

  getInformBySubstanceName(substance_name:string){
    const url: string = environment.baseUrl + "inform_name/"+substance_name;
    return this.http.get(url);
  }

  getInformByCASRN(casrn:string){
    const url: string = environment.baseUrl + "inform_casrn/"+casrn;
    return this.http.get(url);
  }

  getUpstreamTasks(ra_name:string,task_id:string){
    const url: string = environment.baseUrl + "upstream_tasks/"+ra_name+"/"+task_id
    return this.http.get(url);
  }

  /**
   * Get documentation of model 
   * @param m_name 
   * @param version 
   */
  getModelDocumentation(m_name:string,version:number){
    const url: string = environment.baseUrl + "model_documentation/"+m_name+"/"+version;
    return this.http.get(url)
  }
}
