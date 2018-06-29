import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApartmentListComponent } from "./list/list.component";
import { HousingListComponent } from "./housing/houseList/housingList.component";
import { BusinessWoComponent } from "./work-order/business-wo/list/work-order.component";
import { AddWorkOrderComponent } from "./work-order/business-wo/add/add-work-order.component";
import { SendOrderComponent } from "./work-order/sendOrder/send-order.component";
import { ApartmentWoComponent } from "./work-order/apartment-wo/list/list.component";
import { ApartmentWoAddComponent } from "./work-order/apartment-wo/add/add.component";
import { ApartmentWoDetailComponent } from "./work-order/apartment-wo/detail/detail.component";
import { WorkOrderDetailModalComponent } from "./work-order/business-wo/detail/detail-modal.component";
import { AddApartmentModalComponent } from "./add/addModal.component";

const routes : Routes = [
    { path: 'list/list', component: ApartmentListComponent },
    { path: 'housingManagement/housingList/housingList/:id', component: HousingListComponent },
    { path: 'housingManagement/housingList/housingList', component: HousingListComponent },
    { path: 'business/list/list', component: BusinessWoComponent },
    { path: 'business/add/add', component: AddWorkOrderComponent },
    { path: 'sendOrder/:ids', component: SendOrderComponent },
    { path: 'apartment/list/list', component: ApartmentWoComponent },
    { path: 'apartmentWo/add/add',component:ApartmentWoAddComponent},
    { path: 'apartmentWo/detail/detail/:id',component:ApartmentWoDetailComponent},
    { path: 'businessWo/detail-modal/detail-modal/:id',component:WorkOrderDetailModalComponent},
    { path: 'apartment/add/addModal',component:AddApartmentModalComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApartmentRoutingModule {}