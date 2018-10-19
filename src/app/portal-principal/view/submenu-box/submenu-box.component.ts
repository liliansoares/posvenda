import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-submenu-box',
  templateUrl: './submenu-box.component.html',
  styleUrls: ['./submenu-box-component.min.css']
})

export class SubmenuBoxComponent implements OnInit {

  @Input() obj: any;
  @Input() index: number;
 
  @Output() onSubitemClicked = new EventEmitter()

  constructor() { }
  ngOnInit() {    
  }

  subsecaoSelecionada() {
    //console.log("sub")
    this.onSubitemClicked.emit()
  }
}

