import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { NotFoundComponent } from './comuns/not-found/not-found.component';
import { AppComponent } from './app.component';

import { LoginComponent } from './portal-principal/view/login/login.component';
import { FooterInternasComponent } from './portal-principal/view/footer-internas/footer-internas.component';
import { LoginFooterComponent } from './portal-principal/view/login-footer/login-footer.component';
import { FullLayoutComponent } from './portal-principal/view/full-layouts/full-layout.component';
import { BreadcrumbPipe } from './portal-principal/view/full-layouts/breadcrumb.pipe';

import { AlertService } from './service/alert.service';
import { PropertiesService } from './service/properties.service';
import { MyHttp } from './service/myhttp';
import { AuthService } from './portal-principal/service/auth.service';

import { AppConfig } from './app.config';

import { AppRoutingModule, routes } from './app.routing.module';
import { DefaultComponentsModule } from './comuns/default-components/default-components.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardRoutingModule } from './dashboard/dashboard-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FooterInternasComponent,
    LoginFooterComponent,
    FullLayoutComponent,
    BreadcrumbPipe,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    DashboardModule,
    DashboardRoutingModule,    
    FormsModule,
    ReactiveFormsModule,
    DefaultComponentsModule    
  ],
  
  exports: [RouterModule],

  providers: [
    AppConfig,
    AuthService,
    AppConfig,
    AlertService,
    PropertiesService,
    { provide: Http, useClass: MyHttp },
    { provide: LOCALE_ID, useValue: 'pt-BR'}
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }