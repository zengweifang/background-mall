
// module
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { BusinessRoutingModule } from './business-routing.module';
// components
import { BusinessListComponent } from './business-list/business-list.component';
import { BusinessAddComponent } from './business-add/business-add.component';
// services
import { BusinessListService } from './business-list/business-list.service';
import { OperationListService } from '../operation/operation-list.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    BusinessRoutingModule
  ],
  entryComponents: [
    BusinessAddComponent,
  ],
  declarations: [BusinessListComponent, BusinessAddComponent],
  providers: [BusinessListService, OperationListService]
})
export class BusinessModule { }
