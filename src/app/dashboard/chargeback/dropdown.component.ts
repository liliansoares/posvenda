import { Observable } from 'rxjs/Observable';
import { DropdownValue } from './dropdown';
import { Component, Input, Output, ElementRef } from '@angular/core';
import { EventEmitter } from "@angular/core";



@Component({
    selector: 'dropdown',
    template: `
     <ul>
      <li *ngFor = "let value of values" (click)="select(value.value)">{{value.label}}</li>
     </ul> 
    `
})
export class DropdownComponent {
    @Input()
    values: DropdownValue[];

    @Input()
    value: string[];

    @Output()
    valueChange: EventEmitter<''>;

    constructor( private elementRef : ElementRef){
        this.valueChange = new EventEmitter();
    }

    select(value){
        this.valueChange.emit(value);
    }
}

