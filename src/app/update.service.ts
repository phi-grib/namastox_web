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
    const formData = new FormData();
    formData.append("general",JSON.stringify(info))
    const url: string = environment.baseUrl + "general_info/"+ra_name;
    return this.http.put(url,formData)
  }

  updateResult(ra_name:string,info:any){
    const formData = new FormData();
    formData.append("result",JSON.stringify(info))
    const url: string = environment.baseUrl + "result/"+ra_name;
    return this.http.put(url,formData);

  }

  updateLink(ra_name:string,file:any){
    const formData = new FormData();
    formData.append("file",file)
    const url:string = environment.baseUrl + "link/"+ra_name;
    return this.http.post(url,formData);
  }


}
