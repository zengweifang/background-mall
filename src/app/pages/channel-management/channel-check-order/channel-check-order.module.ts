
// 特性模块需要引入自身需要的module才能使用
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ChannelCheckOrderRoutingModule } from './channel-check-order-routing.module';
import { SharedModule } from "../../../shared/shared.module";
// components
import { ChannelCheckOrderComponent } from './channel-check-order.component';
import { ChannelCheckOrderGoodsListComponent } from './channel-check-order-goods-list/channel-check-order-goods-list.component';
import { ChannelCheckOrderServiceListComponent } from './channel-check-order-service-list/channel-check-order-service-list.component';

// services
import { ChannelCheckOrderService } from "./channelCheckOrder.service";

import {DatePipe} from "@angular/common"; 


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ChannelCheckOrderRoutingModule,
    SharedModule
  ],
  declarations: [ChannelCheckOrderComponent,ChannelCheckOrderGoodsListComponent,ChannelCheckOrderServiceListComponent],
  providers: [ChannelCheckOrderService,DatePipe],
})
export class ChannelCheckOrderModule { }
