import { Component } from '@angular/core';
import { User } from '../globals';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {

  constructor(public user:User,private cookieService: CookieService){

  }

  logout(){
    this.cookieService.delete("username",'/')
    this.user.username = '';
    this.user.password = '';
    this.user.status = false;
  }
}
