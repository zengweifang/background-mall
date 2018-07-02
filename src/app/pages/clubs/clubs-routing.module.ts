import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClubsListComponent } from "./list/list.component";
import { AddClubsComponent } from "./add/add.component";
import { EditClubsComponent } from "./edit/edit.component";

const routes : Routes = [
    { path: 'list/list', component: ClubsListComponent },
    { path: 'add/add',component:AddClubsComponent},
    { path: 'edit/edit',component:EditClubsComponent}
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClubsRoutingModule {}