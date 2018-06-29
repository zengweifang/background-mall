import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseAttributeListComponent } from './base-attribute-list/base-attribute-list.component';
import { BaseAttributeAddComponent } from './base-attribute-add/base-attribute-add.component';

const routes : Routes = [
    { path: 'list', component: BaseAttributeListComponent },
    { path: 'add', component: BaseAttributeAddComponent }
]

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class BaseAttributeRoutingModule {}