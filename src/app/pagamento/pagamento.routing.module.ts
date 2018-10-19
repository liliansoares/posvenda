import { ReagendamentoComponent } from './view/reagendamento/reagendamento.component';
import { TratamentoQuedaComponent } from './view/tratamento-queda/tratamento-queda.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export var routesPagamento: Routes = [
    { path: 'tratqueda', component: TratamentoQuedaComponent },
    { path: 'reagenda', component: ReagendamentoComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routesPagamento, { useHash: true })],
    exports: [RouterModule]
})
export class PagamentoRoutingModule { }