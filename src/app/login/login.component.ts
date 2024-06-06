import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../globals';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  constructor(private cookieService: CookieService,public user:User){}
  ngOnInit(): void {
    this.getCookie()
  }

  setCookie() {
    this.cookieService.set('username', this.user.username, { expires: 1, path: '/' });
  }

  getCookie() {
    this.user.username = this.cookieService.get('username');

if(this.user.username){
  this.user.status = true;
  alert('Logged with user '+this.user.username);
}
  }
  onSubmit(){
    this.setCookie();
    this.user.status = true;
  }

}
