import { NotFoundComponent } from './comuns/not-found/not-found.component';

import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './portal-principal/view/login/login.component';
import { AuthGuard } from './auth.guard';
import { FullLayoutComponent } from './portal-principal/view/full-layouts/full-layout.component';

export var routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: FullLayoutComponent,
        data: {
            title: 'Home'
        }, 
        children: [
    
            {
                path: 'posvenda',
                loadChildren: './dashboard/dashboard.module#DashboardModule',                
            }                                  
        ]
    },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }