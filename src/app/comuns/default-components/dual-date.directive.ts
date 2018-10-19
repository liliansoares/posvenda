import { Directive } from '@angular/core';
declare var $:any

@Directive({
  selector: '[appDualDate]',
  host:{
    "class":"input-daterange",
    "data-date-format":"dd/mm/yyyy",
  }
})
export class DualDateDirective {

  constructor() {}
  ngAfterViewInit(){
    $(document).ready(function () {
      
      $('.input-daterange').datepicker({
        format: 'dd/mm/yyyy',                
        language: 'pt',
        clearBtn:true
      })
    });
  }
}
