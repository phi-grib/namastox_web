import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KeycloackService {

  constructor(private http: HttpClient) { }


  getSessionUser() {
    const url: string = environment.baseUrl + 'user_session/';
    return this.http.get(url);
  }

}
