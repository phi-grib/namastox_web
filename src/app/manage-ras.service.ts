import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ManageRAsService {

  constructor(private http: HttpClient) { }
  // create new RA
  createRA(ra_name:string){
    const url: string = environment.baseUrl + "new/"+ra_name
    return this.http.put(url,null)
  }
  // delete RA
  deleteRA(ra_name: string){
    const url: string = environment.baseUrl +"delete/"+ra_name
    return this.http.put(url,null)
  }
  // delete Step
  deleteStep(ra_name:string,step:number){
    const url:string = environment.baseUrl + "delete/"+ra_name+"/"+step;
    return this.http.put(url,null)
  }

  exportRA(ra_name:string){
    const url: string = environment.baseUrl + "export/"+ra_name;
    return this.http.get(url);
  }

  importRA(file){
    const formData = new FormData();
    formData.append('file', file);
    const url: string = environment.baseUrl + 'import';
    return this.http.post(url,formData)
  }
  
}
