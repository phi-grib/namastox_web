import { Component } from '@angular/core';
import { User } from '../globals';
import { CookieService } from 'ngx-cookie-service';
import { KeycloackService } from '../keycloak.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {

  constructor(public user:User,private cookieService: CookieService,private keycloackService:KeycloackService){

  }
  
  logout(){
    this.user.username = undefined
  }
}
