import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NzTreeModule } from 'ng-tree-antd';
import { NgZorroAntdModule } from 'ng-zorro-antd';


import { SendOrderRoutingModule } from "./send-order-routing.module";
import { SendOrderService } from "./send-order.service";

import { SendOrderListComponent } from "./send-order-list/send-order-list.component";
import { ProviderAddModalComponent } from "./send-order-list/provider-add-modal.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        SendOrderRoutingModule,
        NzTreeModule
    ],
    declarations: [
        SendOrderListComponent,
        ProviderAddModalComponent,
    ],
    entryComponents: [
        ProviderAddModalComponent,
    ],
    providers: [SendOrderService]
})

export class SendOrderModule { }
