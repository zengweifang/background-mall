import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SupplierManageRoutingModule } from './supplier-manage-routing.module';
import { NzTreeModule } from 'ng-tree-antd';
import { SupplierManageListComponent } from './supplier-manage-list/supplier-manage-list.component';
import { ProviderStatusPipe } from './supplier-manage.pipe';
import { GoodsTypePipe } from './supplier-check/supplier-check-operate/goods-type.pipe';
import { SharedModule } from '../../shared/shared.module';
import { SupplierAddBasicComponent } from './supplier-add/supplier-add-basic/supplier-add-basic.component';
import { SupplierAddOperateComponent } from './supplier-add/supplier-add-operate/supplier-add-operate.component';
import { SupplierAddFinanceComponent } from './supplier-add/supplier-add-finance/supplier-add-finance.component';
import { SupplierEditBasicComponent } from './supplier-edit/supplier-edit-basic/supplier-edit-basic.component';
import { SupplierCheckBasicComponent } from './supplier-check/supplier-check-basic/supplier-check-basic.component';
import { SupplierCheckOperateComponent } from './supplier-check/supplier-check-operate/supplier-check-operate.component';
import { SupplierAuditBusinessListComponent } from './supplier-audit-business/supplier-audit-business-list/supplier-audit-business-list.component';
import { SupplierAuditBusinessDetailComponent } from './supplier-audit-business/supplier-audit-business-detail/supplier-audit-business-detail.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTreeModule,
    NgZorroAntdModule,
    SupplierManageRoutingModule,
    SharedModule
  ],
  declarations: [SupplierManageListComponent, ProviderStatusPipe,SupplierAddBasicComponent, SupplierAddOperateComponent, SupplierAddFinanceComponent, SupplierEditBasicComponent, SupplierCheckBasicComponent, SupplierCheckOperateComponent,SupplierAuditBusinessListComponent, SupplierAuditBusinessDetailComponent,GoodsTypePipe],
  providers: []
})
export class SupplierManageModule { }
