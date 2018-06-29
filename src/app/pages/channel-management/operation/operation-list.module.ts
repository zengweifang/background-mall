import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedModule } from '../../../shared/shared.module';
import { OperationListRoutingModule } from "./operation-list-routing.module";
import { OperationListService } from "./operation-list.service";

import { OperationListComponent } from "./operation-list/operation-list.component";
import { OperationGoodsManagementComponent } from "./operation-goods-management/operation-goods-management.component";


import { OperationGoodsImportModalComponent } from "./operation-goods-management/operation-goods-import-modal.component";
import { OperationGoodsAddModalComponent } from "./operation-goods-management/operation-goods-add-modal.component";
import { ChannelCheckOrderComponent } from "./operation-order/channel-check-order.component";
import { ChannelCheckOrderListComponent } from "./operation-order/list/channel-check-order-list.component";
import { SecondChannelComponent } from "./second-channel/second-channel.component";
import { SecondChannelAddModalComponent } from "./second-channel/second-channel-add-modal.component";
import { DianpingPackageManagementComponent } from "./dianping/dianping-package-management.component";
import { RemarkModalComponent } from "./operation-order/list/remark-modal.component";
import { DianpingAddGoodsComponent } from "./dianping/dianping-add-goods/dianping-add-goods.component";
import { DianpingCheckGoodsComponent } from "./dianping/dianping-check-goods/dianping-check-goods.component";
import { DianpingEditPackageComponent } from "./dianping/dianping-edit-package/dianping-edit-package.component";
import { DianpingEditGoodsComponent } from "./dianping/dianping-edit-goods/dianping-edit-goods.component";
import { FlowOrderLogComponent } from "./operation-order/list/flow-order-log/flow-order-log.component";
import { PatchResendModalComponent } from "./operation-order/list/flow-order-log/patch-resend-modal.component";
import { PlaceOrderModalComponent } from "./operation-order/list/flow-order-log/place-order-modal.component";
import { CancelOrderModalComponent } from "./operation-order/list/flow-order-log/cancel-order-modal.component";
import { DianpingGoodsAddModalComponent } from "./dianping/dianping-edit-package/dianping-goods-add-modal.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        OperationListRoutingModule,
        SharedModule
    ],
    declarations: [
        OperationListComponent,
        OperationGoodsManagementComponent,
        OperationGoodsImportModalComponent,
        OperationGoodsAddModalComponent,
        ChannelCheckOrderComponent,
        ChannelCheckOrderListComponent,
        SecondChannelComponent,
        SecondChannelAddModalComponent,
        DianpingPackageManagementComponent,
        RemarkModalComponent,
        DianpingAddGoodsComponent,
        DianpingEditGoodsComponent,
        DianpingCheckGoodsComponent,
        DianpingEditPackageComponent,
        FlowOrderLogComponent,
        PatchResendModalComponent,
        PlaceOrderModalComponent,
        CancelOrderModalComponent,
        DianpingGoodsAddModalComponent,
    ],
    entryComponents: [
        OperationGoodsImportModalComponent,
        OperationGoodsAddModalComponent,
        SecondChannelAddModalComponent,
        RemarkModalComponent,
        PatchResendModalComponent,
        PlaceOrderModalComponent,
        CancelOrderModalComponent,
        DianpingGoodsAddModalComponent,
    ],
    providers: [OperationListService]
})

export class OperationListModule { }
