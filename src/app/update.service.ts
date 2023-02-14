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

  updateResult(ra_name:string,info:any){
    console.log("UPDATE RESULT")
    console.log("INFO:")
    console.log(info)
    const formData = new FormData();
    formData.append("result",info)
    const url: string = environment.baseUrl + "result/"+ra_name;
    return this.http.put(url,formData);

  }


}
