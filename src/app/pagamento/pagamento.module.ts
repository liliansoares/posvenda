import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PagamentoRoutingModule } from './pagamento.routing.module';
import { TratamentoQuedaComponent } from './view/tratamento-queda/tratamento-queda.component';
import { ReagendamentoComponent } from './view/reagendamento/reagendamento.component';

@NgModule({
    declarations: [TratamentoQuedaComponent, 
                   ReagendamentoComponent],
    imports: [CommonModule,
              PagamentoRoutingModule],
    providers: []
  })

export class PagamentoModule { }
