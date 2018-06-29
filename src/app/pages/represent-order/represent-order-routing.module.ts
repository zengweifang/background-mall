import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderMsgComponent } from './order-msg/order-msg.component';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { CreatOrderComponent } from './creat-order/creat-order.component';
const routes : Routes = [
    { path: 'orderMsg', component: OrderMsgComponent },
    { path: 'goodsList', component: GoodsListComponent },
    { path: 'creatOrder', component: CreatOrderComponent }
]

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class RepresentOrderRoutingModule {}