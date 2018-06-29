import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendOrderListComponent } from './send-order-list/send-order-list.component';

const routes : Routes = [
    { path: 'sendOrders', component: SendOrderListComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SendOrderRoutingModule {}