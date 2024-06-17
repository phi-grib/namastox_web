import { Component } from '@angular/core';
import { User } from '../globals';
import { CookieService } from 'ngx-cookie-service';
import { KeycloackService } from '../keycloack.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {

  constructor(public user:User,private cookieService: CookieService,private keycloackService:KeycloackService){

  }

  logout(){
    this.keycloackService.getSessionUser().subscribe({
      next: (result:any) => {
        if(result){
          this.user.username = result['username']
          this.user.id_token = result["id_token"]
          this.user.status = true
        }else {
          this.user.username = ""
          this.user.id_token = ""
          this.user.status = false
        }
      },
      error:(e) => {
        console.log(e)
      }
    })
  }
}
