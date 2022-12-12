import { NgModule } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule } from "@angular/material/paginator";
import { MyTransactionListIntl } from "./transactions-paginator";
import { TransactionListComponent } from "../../views/transaction-list/transaction-list.component";

@NgModule({
  imports: [MatPaginatorModule],
  providers: [{ provide: MatPaginatorIntl, useClass: MyTransactionListIntl }],
})
export class TransactionsPaginatorModule { }
