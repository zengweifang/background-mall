import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessListComponent } from './business-list/business-list.component';
import { BusinessAddComponent } from './business-add/business-add.component';

const routes : Routes = [
    { path: 'list', component: BusinessListComponent }
]

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class BusinessRoutingModule {}