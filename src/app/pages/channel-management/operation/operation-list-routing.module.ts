import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationListComponent } from './operation-list/operation-list.component';
import { OperationGoodsManagementComponent } from './operation-goods-management/operation-goods-management.component';
import { ChannelCheckOrderComponent } from "./operation-order/channel-check-order.component";
import { SecondChannelComponent } from "./second-channel/second-channel.component";
import { DianpingPackageManagementComponent } from "./dianping/dianping-package-management.component";
import { DianpingAddGoodsComponent } from "./dianping/dianping-add-goods/dianping-add-goods.component";
import { DianpingEditGoodsComponent } from "./dianping/dianping-edit-goods/dianping-edit-goods.component";
import { DianpingCheckGoodsComponent } from "./dianping/dianping-check-goods/dianping-check-goods.component";
import { DianpingEditPackageComponent } from "./dianping/dianping-edit-package/dianping-edit-package.component";
import { FlowOrderLogComponent } from "./operation-order/list/flow-order-log/flow-order-log.component";

const routes : Routes = [
    { path: 'list', component: OperationListComponent },
    { path: 'operationGoodsManagement/:id/:name', component: OperationGoodsManagementComponent },
    { path: 'serviceOrderList', component: ChannelCheckOrderComponent },
    { path: 'operationOrders/:channelId/:channelName', component: ChannelCheckOrderComponent },
    { path: 'secondChannel/:channelId/:channelName', component: SecondChannelComponent },
    { path: 'dianping/addGoods/:channelId/:channelName', component: DianpingAddGoodsComponent },
    { path: 'dianping/editGoods/:id', component: DianpingEditGoodsComponent },
    { path: 'dianping/checkGoods/:id', component: DianpingCheckGoodsComponent },
    { path: 'dianping/editPackage/:goodsId/:channelId/:channelName', component: DianpingEditPackageComponent },
    { path: 'dianping/:channelId/:channelName', component: DianpingPackageManagementComponent },
    { path: 'flowOrderLog/:id/:orderId/:channelName/:goodsTypeId', component: FlowOrderLogComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OperationListRoutingModule {}