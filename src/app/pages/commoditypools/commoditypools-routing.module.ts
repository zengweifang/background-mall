import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommoditypoolsListComponent } from "./list/list.component";
import { AddCommoditypoolsComponent } from "./add/add.component";
import { EditCommoditypoolsComponent } from "./edit/edit.component";

const routes : Routes = [
    { path: 'list/list', component: CommoditypoolsListComponent },
    { path: 'add/add',component:AddCommoditypoolsComponent},
    { path: 'edit/edit',component:EditCommoditypoolsComponent}
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommoditypoolsRoutingModule {}