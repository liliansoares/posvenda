

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { HelpBoxComponent } from './help-box/help-box.component';
import { TableDefaultComponent } from './table-default/table-default.component';
import { ColumnTableNamePipe } from './table-default/column-table-name.pipe';
import { ColumnTableIdPipe } from './table-default/column-table-id.pipe';
import { CrudControlActionsComponent } from './crud-control-actions/crud-control-actions.component';
import { EditableLabelComponent } from './editable-label/editable-label.component';
import { TablePaginationsComponent } from './table-default/table-paginations/table-paginations.component'
import { SubmenuBoxComponent } from './../../portal-principal/view/submenu-box/submenu-box.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    InputComponent,
    HelpBoxComponent,
    TableDefaultComponent,
    ColumnTableNamePipe,
    ColumnTableIdPipe,
    CrudControlActionsComponent,
    EditableLabelComponent,
    TablePaginationsComponent,
    SubmenuBoxComponent
  ],
  exports: [
    InputComponent,
    HelpBoxComponent,
    TableDefaultComponent,
    ColumnTableNamePipe,
    ColumnTableIdPipe,
    CrudControlActionsComponent ,
    EditableLabelComponent,
    TableDefaultComponent,
    SubmenuBoxComponent
  ]

})
export class DefaultComponentsModule { }
