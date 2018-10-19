import { Component, OnInit, Input} from '@angular/core';
@Component({
  selector: 'app-help-box',
  templateUrl: './help-box.component.html',
  styleUrls: ['./help-box.component.min.css']
})
export class HelpBoxComponent implements OnInit {

  @Input() componentId : string = "help_box"
  @Input() title : string = ""
  @Input() idDom : string = "help-box"

  constructor() { }

  ngOnInit() {
  }

}
