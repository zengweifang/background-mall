import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseListComponent } from "./list/list.component";
import { AddBaseComponent } from "./add/add.component";
import { EditBaseComponent } from "./edit/edit.component";

const routes : Routes = [
    { path: 'list/list', component: BaseListComponent },
    { path: 'add/add',component:AddBaseComponent},
    { path: 'edit/edit',component:EditBaseComponent}
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BaseRoutingModule {}