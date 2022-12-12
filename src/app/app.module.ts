import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransactionModule } from "./services/transaction/transaction.module";
import { CookieModule } from "./services/cookie/cookie.module";
import { API_BASE_URL } from "./services/transaction/transaction.service";
import { environment } from "../environments/environment";
import { MaterialModule } from "./modules/material/material.module";
import { TransactionListComponent } from './views/transaction-list/transaction-list.component';
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { TransactionAddComponent } from './views/transaction-add/transaction-add.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TransactionPopupComponent } from './components/transaction-popup/transaction-popup.component';
import { TransactionsPaginatorModule } from "./modules/paginator/transactions-paginator.module";
import { InvoicePopupComponent } from './components/invoice-popup/invoice-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionListComponent,
    TransactionAddComponent,
    TransactionPopupComponent,
    InvoicePopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TransactionModule,
    CookieModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TransactionsPaginatorModule
  ],
  providers: [
    { provide: API_BASE_URL, useValue: environment.API_BASE_URL },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
