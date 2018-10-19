import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-editable-label',
  templateUrl: './editable-label.component.html'
})
export class EditableLabelComponent implements OnInit {

  @Output() confirmEdition : EventEmitter<any> = new EventEmitter()
  @Output() confirmDeletion : EventEmitter<any> = new EventEmitter()

  @Input() value : any
  @Input() actionsEnabled : boolean = true

  private  _editModeOn = false

  constructor() { }

  ngOnInit() {
  }

  /**
   * Controla o botão de edição, dando ou removendo o acesso a edição do campo
   * quando o modo de edição é finalizado, lança o evento de confirmação de edição
   * confirmEdition
   * @param value novo valor do input
   */
  toogleEditMode(newValue){
    this._editModeOn = !this._editModeOn
    // significa que foi confirmada a edicao   
    if(!this._editModeOn) {
      //notifico que a edicao foi confirmada
      this.confirmEdition.emit(newValue)
    }
  }

  /**
   * Chamado quanto o botão de deletar é pressionado
   * @param value valor do input que será deletado
   */
  delete(value) {
    // todo : lançar alert de confirmação; caso aceito, lança evento de confirmação de deleção; confirmDeletion
    this.confirmDeletion.emit(value)

  }

}
