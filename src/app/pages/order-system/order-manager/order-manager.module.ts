import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { OrderManagerRoutingModule } from './order-manager-routing.module';
import { OrderManagerListComponent } from './order-manager-list/order-manager-list.component';
import { OrderManagerService } from './order-manager.service';
import { SharedModule } from "../../../shared/shared.module";
import { OrderManagerListCapitalFlowModalComponent } from './order-manager-list/order-manager-list-capital-flow-modal.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    OrderManagerRoutingModule,
    SharedModule
  ],
  declarations: [OrderManagerListComponent,OrderManagerListCapitalFlowModalComponent],
  entryComponents: [
    OrderManagerListCapitalFlowModalComponent
  ],
  providers: [OrderManagerService]
})
export class OrderManagerModule { }
