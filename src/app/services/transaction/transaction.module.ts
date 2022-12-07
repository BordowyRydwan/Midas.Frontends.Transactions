import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { TransactionApiService } from "./transaction.service";

@NgModule({
  imports: [ HttpClientModule ],
  providers: [ TransactionApiService ]

})
export class TransactionModule { }
