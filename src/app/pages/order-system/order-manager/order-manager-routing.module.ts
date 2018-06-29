import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderManagerListComponent } from './order-manager-list/order-manager-list.component';

const routes : Routes = [
    { path: 'serviceOrderList', component: OrderManagerListComponent }
]

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class OrderManagerRoutingModule {}