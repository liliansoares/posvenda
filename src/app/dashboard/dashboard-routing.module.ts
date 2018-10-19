import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChargebackComponent } from '../dashboard/chargeback/chargeback.component';
import { ConsultaCobrancaComponent } from '../cobranca/consulta-cobranca/consulta-cobranca.component';
import { TratamentoQuedaComponent } from './../pagamento/view/tratamento-queda/tratamento-queda.component';

export const routesDashboard: Routes = [
  {
    path: 'chargeback',
    component: ChargebackComponent
  },
  {
    path: 'consultaCobranca',
    component: ConsultaCobrancaComponent

  },
  {path:'ppe-cadastro',
   component: TratamentoQuedaComponent}  
];

@NgModule({
  imports: [RouterModule.forChild(routesDashboard)],
  exports: [RouterModule],
  providers: []
})

export class DashboardRoutingModule {
  constructor() { }
}
