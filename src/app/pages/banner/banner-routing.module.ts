import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BannerListComponent } from "./list/list.component";
import { AddBannerComponent } from "./add/add.component";
import { EditBannerComponent } from "./edit/edit.component";

const routes : Routes = [
    { path: 'list/list', component: BannerListComponent },
    { path: 'add/add',component:AddBannerComponent},
    { path: 'edit/edit',component:EditBannerComponent}
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BannerRoutingModule {}