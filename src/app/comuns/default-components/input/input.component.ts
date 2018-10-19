import { Component, OnInit, Input, ContentChild, AfterContentInit } from '@angular/core';
import { NgModel, FormControlName } from '@angular/forms';

@Component({
  selector: 'app-input-container',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.min.css']  
})
export class InputComponent implements OnInit , AfterContentInit {
    
   @Input() label: string
   @Input() errorMessage: string
    
   input: any
    
   @ContentChild(NgModel) model: NgModel
   @ContentChild(FormControlName) control: FormControlName

  constructor() { }

  ngOnInit() {
  }  
  
  ngAfterContentInit(){      
      this.input = this.model || this.control
      if(this.input === undefined){
          throw new Error("Esse componente precisa ser usado com ngModel ou com FormControlName")
      }
  } 
    
  hasError():boolean{
      return this.input.invalid && (this.input.dirty || this.input.touched)
  }    

}
