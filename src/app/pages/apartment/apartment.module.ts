import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FileUploadModule } from 'ng2-file-upload';

import { ApartmentRoutingModule } from "./apartment-routing.module";
import { ApartmentListComponent } from "./list/list.component";
import { HousingListComponent } from "./housing/houseList/housingList.component";
import { EditApartmentModalComponent } from "./edit/editModal.component";
import { AddApartmentModalComponent } from "./add/addModal.component";
import { HouseAddModalComponent } from "./housing/houseAdd/houseAddModal.component";
import { HouseEditModalComponent } from "./housing/houseEdit/houseEditModal.component";
import { BusinessWoComponent } from "./work-order/business-wo/list/work-order.component";
import { WorkOrderDetailModalComponent } from "./work-order/business-wo/detail/detail-modal.component";
import { AddWorkOrderComponent } from "./work-order/business-wo/add/add-work-order.component";
import { SendOrderComponent } from "./work-order/sendOrder/send-order.component";

import { ApartmentService } from "./apartment.service";
import { SharedModule } from "../../shared/shared.module";
import { ApartmentWoComponent } from './work-order/apartment-wo/list/list.component';
import { ApartmentWoAddComponent } from './work-order/apartment-wo/add/add.component';
import { ApartmentWoDetailComponent } from './work-order/apartment-wo/detail/detail.component';
import { RejectWoComponent } from './work-order/apartment-wo/modal/reject-wo/reject-wo.component';
import { UnsatistyWoComponent } from './work-order/apartment-wo/modal/unsatisty-wo/unsatisty-wo.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        ApartmentRoutingModule,
        FileUploadModule,
        SharedModule
    ],
    declarations: [
        ApartmentListComponent,
        HousingListComponent,
        EditApartmentModalComponent,
        AddApartmentModalComponent,
        HouseAddModalComponent,
        HouseEditModalComponent,
        BusinessWoComponent,
        WorkOrderDetailModalComponent,
        AddWorkOrderComponent,
        SendOrderComponent,
        ApartmentWoComponent,
        ApartmentWoAddComponent,
        ApartmentWoDetailComponent,
        RejectWoComponent,
        UnsatistyWoComponent
    ],
    entryComponents: [EditApartmentModalComponent,
        AddApartmentModalComponent,
        HouseAddModalComponent,
        HouseEditModalComponent,
        WorkOrderDetailModalComponent,
        RejectWoComponent,
        UnsatistyWoComponent
    ],
    providers: [ApartmentService]
})

export class ApartmentModule { }
