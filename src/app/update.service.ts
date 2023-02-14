import { Injectable } from '@angular/core';
import { environment } from "../environments/environment";
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private http: HttpClient) { }
  
  updateGeneralInformation(ra_name:string,info:any){
    // const formData = new FormData();
    const url: string = environment.baseUrl + "general_info/"+ra_name;
    return this.http.put(url,{"general":info})
  }


}
