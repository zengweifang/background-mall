import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApartmentListComponent } from "./list/list.component";
import { AddApartmentModalComponent } from "./add/addModal.component";

const routes : Routes = [
    { path: 'list/list', component: ApartmentListComponent },
    { path: 'apartment/add/addModal',component:AddApartmentModalComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApartmentRoutingModule {}