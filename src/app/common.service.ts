import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private http: HttpClient) {}
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


  /**get results */
  
}
