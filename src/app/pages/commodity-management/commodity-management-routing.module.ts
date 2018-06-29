import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from "./management/management.component";
import { GoodEditComponent } from "./good-edit/good-edit.component";
import { TypeAddComponent } from "./type-add/type-add.component";
import { ShelvesComponent } from "./shelves/shelves.component";


const routes : Routes = [
    { path: 'list/list/13', component: ManagementComponent },
    { path: 'edit/:goodsId', component: GoodEditComponent },
    { path: 'new', component: GoodEditComponent },
    { path: 'typeAdd', component: TypeAddComponent },
    { path: 'shelves/:goodsId', component: ShelvesComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommodityManagementRoutingModule {}