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
import { TransactionPopupComponent } from './views/transaction-popup/transaction-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionListComponent,
    TransactionPopupComponent
  ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      TransactionModule,
      CookieModule,
      MaterialModule
    ],
  providers: [{
    provide: API_BASE_URL, useValue: environment.API_BASE_URL
  }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
