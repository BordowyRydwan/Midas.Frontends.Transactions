import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyRouteComponent } from "./empty-route/empty-route.component";
import { SessionGuard } from "./guards/session.guard";
import { TransactionListComponent } from "./views/transaction-list/transaction-list.component";

const routes: Routes = [
  { path: 'transactions', component: TransactionListComponent, canActivate: [ SessionGuard ]},
  { path: '**', component: EmptyRouteComponent },
];

@NgModule({
  declarations: [EmptyRouteComponent],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
