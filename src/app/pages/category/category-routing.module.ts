import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryListComponent } from "./list/list.component";
import { AddCategoryComponent } from "./add/add.component";
import { EditCategoryComponent } from "./edit/edit.component";

const routes : Routes = [
    { path: 'list/list', component: CategoryListComponent },
    { path: 'add/add',component:AddCategoryComponent},
    { path: 'edit/edit',component:EditCategoryComponent}
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoryRoutingModule {}