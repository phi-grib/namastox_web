import { Component } from '@angular/core';
import { RA } from '../globals';
import { CommonService } from '../common.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  constructor(public ra: RA,private commonService: CommonService){

  }
downloadExcel() {
  this.commonService.exportToFile(this.ra.name, 'excel').subscribe (
    result => {
      let blob = new Blob([ result ],{ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, this.ra.name + '.xlsx');
    },
    error => {
      alert('Error downloading documentation in EXCEL format');
    }
  );
}
downloadWord() {
  alert("Not implemented")

}
downloadFile() {
  this.commonService.exportToFile(this.ra.name, 'yaml').subscribe (
    result => {
      let blob = new Blob ([result],  {type: "text/plain;charset=utf-8"})
      saveAs(blob, this.ra.name + '.yaml');
    },
    error => {
      alert('Error downloading documentation in YAML format');
    }
);
}

}
