import { TratamentoQuedaComponent } from './../pagamento/view/tratamento-queda/tratamento-queda.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap';
import { RlTagInputModule } from 'angular2-tag-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { AuxiliarService } from '../portal-principal/service/auxiliar.service';
import { ChargebackService } from './chargeback/chargeback.service';
import { ConsultaCobrancaService } from '../cobranca/consulta-cobranca/consulta-cobranca.service';
import { AlertService } from './../service/alert.service';
import { RelatorioExportService } from '../service/relatorio.service';
import { HistoricoCobrancaService } from '../cobranca/consulta-cobranca/historico-cobranca/historico-cobranca.service';
import { UsuarioService } from '../portal-principal/service/usuario.service';
import { ModalService } from './modal/modal.service';
import { PlataformaService } from '../portal-principal/service/plataforma.service';

// tslint:disable-next-line:max-line-length
import { ConsultaCobrancaDetalhadaComponent } from '../cobranca/consulta-cobranca/consulta-cobranca-detalhada/consulta-cobranca-detalhada.component';
import { DropdownComponent } from './chargeback/dropdown.component';
import { PaginationComponent } from '../comuns/pagination/pagination.component';
import { ChargebackComponent } from '../dashboard/chargeback/chargeback.component';
import { ConsultaCobrancaComponent } from '../cobranca/consulta-cobranca/consulta-cobranca.component';
import { HistoricoCobrancaComponent } from '../cobranca/consulta-cobranca/historico-cobranca/historico-cobranca.component';
import { ModalComponent } from './modal/modal.component';

import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';
import { FileDropModule } from 'ngx-file-drop';
import { FileUploadModule } from 'ng2-file-upload';
import { DefaultComponentsModule } from './../comuns/default-components/default-components.module';

import { FullDateDirective } from '../comuns/default-components/full-date.directive';
import { DualDateDirective } from '../comuns/default-components/dual-date.directive';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    RlTagInputModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    DefaultComponentsModule,
    ReactiveFormsModule,
    HttpModule,
    TextMaskModule,
    FileDropModule,
    FileUploadModule
  ],
  declarations: [
    ChargebackComponent,
    DropdownComponent,
    DualDateDirective,
    FullDateDirective,
    ModalComponent,
    ConsultaCobrancaComponent,
    ConsultaCobrancaDetalhadaComponent,
    PaginationComponent,
    HistoricoCobrancaComponent,
    TratamentoQuedaComponent
  ],
  providers: [
    AlertService,
    DatePipe,
    PlataformaService,
    UsuarioService,
    ChargebackService,
    AuxiliarService,
    ModalService,
    ConsultaCobrancaService,
    ChargebackComponent,
    RelatorioExportService,
    HistoricoCobrancaService
  ],
  exports: [
    FullDateDirective,
    DualDateDirective
  ]
})

export class DashboardModule { }
