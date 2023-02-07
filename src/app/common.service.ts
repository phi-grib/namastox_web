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

  getRaList(){
    const url: string = environment.baseUrl + "list";
    return this.http.get(url)
  }

}
