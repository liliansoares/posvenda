import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullLayoutComponent } from './../portal-principal/view/full-layouts/full-layout.component';
import { LoginComponent } from './../portal-principal/view/login/login.component';
import { NotFoundComponent } from './../comuns/not-found/not-found.component';


export var routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: FullLayoutComponent
    },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class ComissionamentoRoutingModule { }