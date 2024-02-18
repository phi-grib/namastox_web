import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { RA } from '../globals';
import { CommonFunctions } from '../common.functions';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit {
  constructor(private ra:RA,private commonService:CommonService,private func: CommonFunctions){

  }
  // variables for test (change when receive object from backend).
  title:string = "";
  text: string = "";
  
  ngOnInit(): void {
  
  }
  /**
   * improve this function, change for native form function
   */
  resetFields(){
    this.title = ""
    this.text = ""
  }

  onSubmit(){
    var note = {}
    console.log("title",this.title)
    console.log("text",this.text)
    this.commonService.saveNote(this.ra.name,this.title,this.text).subscribe({
      next: (result) => {
        setTimeout(() => {
          this.commonService.getNotes(this.ra.name).subscribe({
            next: (result)=> {
              console.log("respuesta backend:")
              console.log(result)
              console.log("el array antes de actualizarlo")
              console.log(this.ra.notes)
              // this.ra.notes = undefined
              this.ra.notes = result
              console.log("despues de actualizarlo")
              console.log(this.ra.notes)
            },
            error: (e)=> {
              console.log(e)
            }
          })
        }, 200);
      },
      error: (e) => {
        console.log(e)
      }
    
    }
    )
    this.resetFields();
    //insert function to add note  
    // if it's done , call function: list notes again
  }
}