import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocListComponent } from './doc-list/list.component';
import { DocEditComponent } from './doc-edit/edit.component';
import { DocDetailComponent } from './doc-detail/detail.component';

const routes : Routes = [
    { path: 'list', component: DocListComponent },
    { path: 'edit/:id', component: DocEditComponent },
    { path: 'edit', component: DocEditComponent },
    { path: 'detail/:id', component: DocDetailComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HelpCenterRoutingModule {}