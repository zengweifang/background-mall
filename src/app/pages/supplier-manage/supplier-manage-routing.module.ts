import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierManageListComponent } from './supplier-manage-list/supplier-manage-list.component';
import { SupplierAddBasicComponent } from './supplier-add/supplier-add-basic/supplier-add-basic.component';
import { SupplierAddOperateComponent } from './supplier-add/supplier-add-operate/supplier-add-operate.component';
import { SupplierAddFinanceComponent } from './supplier-add/supplier-add-finance/supplier-add-finance.component';
import { SupplierEditBasicComponent } from './supplier-edit/supplier-edit-basic/supplier-edit-basic.component';
import { SupplierCheckBasicComponent } from './supplier-check/supplier-check-basic/supplier-check-basic.component';
import { SupplierCheckOperateComponent } from './supplier-check/supplier-check-operate/supplier-check-operate.component';
import { SupplierAuditBusinessListComponent } from './supplier-audit-business/supplier-audit-business-list/supplier-audit-business-list.component';
import { SupplierAuditBusinessDetailComponent } from './supplier-audit-business/supplier-audit-business-detail/supplier-audit-business-detail.component';
import { CanDeactivateGuard } from '../../shared/services/can-deactivate-guard.service';
const routes : Routes = [
    { path: 'supplierList/supplierList', component: SupplierManageListComponent },
    { path: 'supplierAdd/addSupplierBasic', component: SupplierAddBasicComponent,canDeactivate: [CanDeactivateGuard]},
    { path: 'supplierAdd/addSupplierOperate/:id', component: SupplierAddOperateComponent,canDeactivate: [CanDeactivateGuard]},
    { path: 'supplierAdd/addSupplierFinance/:id', component: SupplierAddFinanceComponent},
    { path: 'supplierEdit/editSupplierBasic/:id', component: SupplierEditBasicComponent,canDeactivate: [CanDeactivateGuard]},
    { path: 'supplierCheck/checkSupplierBasic/:id', component: SupplierCheckBasicComponent},
    { path: 'supplierCheck/checkSupplierOperate/:id', component: SupplierCheckOperateComponent},
    { path: 'supplierAuditBusiness/supplierAuditBusinessBasic', component: SupplierAuditBusinessListComponent},
    { path: 'supplierAuditBusiness/supplierAuditBusinessDetail/:id/:storeId', component: SupplierAuditBusinessDetailComponent}
]

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class SupplierManageRoutingModule {}