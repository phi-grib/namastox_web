import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-about-software',
  templateUrl: './about-software.component.html',
  styleUrl: './about-software.component.scss'
})
export class AboutSoftwareComponent {
appVersion = environment.appVersion;
}
