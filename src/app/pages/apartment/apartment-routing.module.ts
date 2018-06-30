import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApartmentListComponent } from "./list/list.component";
import { AddApartmentModalComponent } from "./add/addModal.component";
import { EditApartmentModalComponent } from "./edit/editModal.component";

const routes : Routes = [
    { path: 'list/list', component: ApartmentListComponent },
    { path: 'apartment/add/addModal',component:AddApartmentModalComponent},
    { path: 'apartment/edit/editModal',component:EditApartmentModalComponent}
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApartmentRoutingModule {}