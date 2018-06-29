import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreListComponent } from './store-list/store-list.component';
import { StoreAddBasicComponent } from './store-add/store-add-basic/store-add-basic.component';
import { StoreAddAreaComponent } from './store-add/store-add-area/store-add-area.component';
import { StoreAddGoodsComponent } from './store-add/store-add-goods/store-add-goods.component';
import { StoreAddSpTemplatesComponent } from './store-add/store-add-sp-templates/store-add-sp-templates.component';
import { SpTemplatesAddComponent } from './sp-templates/sp-templates-add/sp-templates-add.component';

import { CanDeactivateGuard } from '../../shared/services/can-deactivate-guard.service';
const routes : Routes = [
    { path: 'storeList/storeList', component: StoreListComponent },
    { path: 'storeAdd/storeAddBasic', component: StoreAddBasicComponent,canDeactivate: [CanDeactivateGuard]},
    { path: 'storeAdd/storeAddArea/:id', component: StoreAddAreaComponent,canDeactivate: [CanDeactivateGuard]},
    { path: 'storeAdd/storeAddGoods/:id', component: StoreAddGoodsComponent,canDeactivate: [CanDeactivateGuard]},
    { path: 'storeAdd/storeAddSPTemplates/:id', component: StoreAddSpTemplatesComponent,canDeactivate: [CanDeactivateGuard]},
    { path: 'SPTemplates/SPTemplatesAdd/:id', component: SpTemplatesAddComponent}
]

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class StoreManagementRoutingModule {}