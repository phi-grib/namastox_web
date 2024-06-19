import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  private generateForms = new Subject<String>();
  generateForms$ = this.generateForms.asObservable();
  
  AutoGenerateForm(taskID?: string) {
    this.generateForms.next(taskID);
  }
  /* update workflow */
  private refreshWorkflow = new Subject<boolean>();
  refreshWorklfow$ = this.refreshWorkflow.asObservable();
  updateWorkflow() {
    this.refreshWorkflow.next(true);
  }
  /* render canvas in Overview */
  private updateOverviewCanvas = new BehaviorSubject<boolean>(false);
  updateOverviewCanvas$ = this.updateOverviewCanvas.asObservable();
  drawOverviewCanvas(status: boolean) {
    this.updateOverviewCanvas.next(status);
  }
  /*render canvas in General Information */
  private renderGeneralInfoCanvas =  new Subject<boolean>();
  renderGeneralInfoCanvas$ = this.renderGeneralInfoCanvas.asObservable();
  drawGeneralInfoCanvas(status: boolean) {
    this.renderGeneralInfoCanvas.next(status);
  }

  /**Get list of RAs */
  getRaList() {
    const url: string = environment.baseUrl + 'list';
    return this.http.get(url);
  }
  /**Get steps of ra */
  getSteps(ra_name: string) {
    const url: string = environment.baseUrl + 'steps/' + ra_name;
    return this.http.get(url);
  }
  /**Get General Information RA */
  getGeneralInfo(ra_name: string) {
    const url: string = environment.baseUrl + 'general_info/' + ra_name;
    return this.http.get(url);
  }
  /**Get Status of RA */
  getStatus(ra_name: string) {
    const url: string = environment.baseUrl + 'status/' + ra_name;
    /**change any type to correct interface, good practice  */
    return this.http.get<any>(url);
  }
  /**Get status with  specific step of RA */
  getStatusWithStep(ra_name: string, step: number) {
    const url: string = environment.baseUrl + 'status/' + ra_name + '/' + step;
    return this.http.get<any>(url);
  }
  /**get results */
  getResults(ra_name: string) {
    const url: string = environment.baseUrl + 'results/' + ra_name;
    return this.http.get(url);
  }
  /**get task */
  getTask(ra_name: string, id: string) {
    const url: string = environment.baseUrl + 'task/' + ra_name + '/' + id;
    return this.http.get(url);
  }

  /**get results with specific step of RA */
  getResultsWithStep(ra_name: string, step: number) {
    const url: string = environment.baseUrl + 'results/' + ra_name + '/' + step;
    return this.http.get(url);
  }
  getWorkflowByStep(ra_name: string, step: number) {
    const url: string =
      environment.baseUrl + 'workflow/' + ra_name + '/' + step;
    return this.http.get(url);
  }
  /** get Pending tasks */
  getPendingTasks(ra_name: string) {
    const url: string = environment.baseUrl + 'pending_tasks/' + ra_name;
    return this.http.get(url);
  }
  /**get pending task */
  getPendingTask(ra_name: string, id: String) {
    const url: string =
      environment.baseUrl + 'pending_task/' + ra_name + '/' + id;
    return this.http.get(url);
  }
  getLink(ra_name: string, file_name: string) {
    const url: string =
      environment.baseUrl + 'link/' + ra_name + '/' + file_name;
    return this.http.get(url, { responseType: 'blob' });
  }
  getWorkflow(ra_name: string) {
    const url: string = environment.baseUrl + 'workflow/' + ra_name;
    return this.http.get(url);
  }
  getInformBySubstanceName(substance_name: string) {
    const url: string = environment.baseUrl + 'inform_name/' + substance_name;
    return this.http.get(url);
  }

  getInformByCASRN(casrn: string) {
    const url: string = environment.baseUrl + 'inform_casrn/' + casrn;
    return this.http.get(url);
  }

  getUpstreamTasks(ra_name: string, task_id: string) {
    const url: string =
      environment.baseUrl + 'upstream_tasks/' + ra_name + '/' + task_id;
    return this.http.get(url);
  }
  exportToFile(ra_name:string,format:string): Observable<any> {
    const url: string = environment.baseUrl + "report/" +ra_name+"/"+format;
    
    if(format == "word" || format == "excel"){
      return this.http.get(url,{responseType: 'arraybuffer'})
    }else{
      return this.http.get(url,{responseType:'text'})

    }

  }
  attachments(ra_name: string) {
    const url: string = environment.baseUrl + 'attachments/' + ra_name;
    return this.http.get(url, { responseType: 'blob' });
  }


  getNotes(ra_name:string,step?:number){
    const url:string = environment.baseUrl + "notes/"+ra_name
    if(step){
    const url:string = environment.baseUrl + "notes/"+ra_name+"/"+step
    }
    return this.http.get(url)

  }
  saveNote(ra_name:string,title,text){
    const formData = new FormData();
    formData.append('title',title);
    formData.append('text',text);
    const url: string = environment.baseUrl + "note/"+ra_name;
    return this.http.put(url, formData);
  }
  deleteNote(ra_name:string,id:string){
    const url:string = environment.baseUrl + "note/"+ra_name+"/"+id
    return this.http.delete(url)
  }
}
