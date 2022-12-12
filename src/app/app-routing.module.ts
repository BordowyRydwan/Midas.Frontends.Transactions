import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyRouteComponent } from "./empty-route/empty-route.component";
import { SessionGuard } from "./guards/session.guard";
import { TransactionListComponent } from "./views/transaction-list/transaction-list.component";
import { TransactionAddComponent } from "./views/transaction-add/transaction-add.component";

const routes: Routes = [
  { path: 'transactions/list', component: TransactionListComponent, canActivate: [ SessionGuard ]},
  { path: 'transactions/list/:userid', component: TransactionListComponent, canActivate: [ SessionGuard ]},
  { path: 'transactions/list/:userid/add', component: TransactionAddComponent, canActivate: [ SessionGuard ]},
  { path: '**', component: EmptyRouteComponent },
];

@NgModule({
  declarations: [EmptyRouteComponent],
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule, EmptyRouteComponent ]
})
export class AppRoutingModule { }
