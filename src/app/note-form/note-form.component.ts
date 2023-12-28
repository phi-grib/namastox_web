import { Component, OnInit } from '@angular/core';
import { DateObject } from 'ngx-bootstrap/chronos/types';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit {

  datePickerConfig: Partial<BsDatepickerConfig>;

  // variables for test (change when receive object from backend).
  title:string = "";
  id: string = '';
  information: string = "";
  date:string; // fix error: Format incorrect
  
  constructor() {
    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-default',
      dateInputFormat: 'DD/MM/YYYY', // Formato de fecha
    });
  }
  ngOnInit(): void {
  
  }
  /**
   * improve this function, change for native form function
   */
  resetFields(){
    this.title = ""
    this.id =""
    this.information = ""
    this.date = "";
  }

  onSubmit(){
    console.log("title",this.title)
    console.log("ID",this.id)
    console.log("date",this.date)
    console.log("information",this.information)
    this.resetFields();
    //insert function to add note  
    // if it's done , call function: list notes again
  }

}
