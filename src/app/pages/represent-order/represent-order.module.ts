import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { OrderMsgComponent } from './order-msg/order-msg.component';
import { RepresentOrderRoutingModule } from './represent-order-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { OrderMsgService } from './order-msg/order-msg.service';
import { GoodsListService } from './goods-list/goods-list.service';
import { CreatOrderService } from './creat-order/creat-order.service';
import { AddAndEditModalComponent } from './order-msg/add-and-edit-modal/add-and-edit-modal.component';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { RelationGoodsModalComponent } from './goods-list/relation-goods-modal/relation-goods-modal.component';
import { ShoppingCartModalComponent } from './goods-list/shopping-cart-modal/shopping-cart-modal.component';
import { CreatOrderComponent } from './creat-order/creat-order.component';
@NgModule({
  imports: [
    CommonModule,
    RepresentOrderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    SharedModule
  ],
  declarations: [OrderMsgComponent, AddAndEditModalComponent, GoodsListComponent, RelationGoodsModalComponent, ShoppingCartModalComponent, CreatOrderComponent],
  providers: [OrderMsgService,GoodsListService,CreatOrderService],
  entryComponents: [AddAndEditModalComponent,RelationGoodsModalComponent,ShoppingCartModalComponent]
})
export class RepresentOrderModule { }
