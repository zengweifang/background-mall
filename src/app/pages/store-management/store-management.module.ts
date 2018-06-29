import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NzTreeModule } from 'ng-tree-antd';
import { SharedModule } from '../../shared/shared.module';
import { StoreManagementRoutingModule } from './store-management-routing.module';
import { StoreListComponent } from './store-list/store-list.component';

import { StoreManagementService } from './store-management.service';
import { StoreListService } from './store-list/store-list.service';
import { StoreAddBasicService } from './store-add/store-add-basic/store-add-basic.service';
import { StoreAddGoodsService } from './store-add/store-add-goods/store-add-goods.service';
import { StoreAddSpTemplatesService } from './store-add/store-add-sp-templates/store-add-sp-templates.service';
import { SpTemplatesAddService } from './sp-templates/sp-templates-add/sp-templates-add.service';

import { StoreListModalComponent } from './store-list/store-list-modal/store-list-modal.component';
import { StoreAddBasicComponent } from './store-add/store-add-basic/store-add-basic.component';
import { StoreAddAreaComponent } from './store-add/store-add-area/store-add-area.component';
import { StoreAddGoodsComponent } from './store-add/store-add-goods/store-add-goods.component';
import { StoreAddSpTemplatesComponent } from './store-add/store-add-sp-templates/store-add-sp-templates.component';
import { SpTemplatesAddComponent } from './sp-templates/sp-templates-add/sp-templates-add.component';
import { SpTemplatesAddModalComponent } from './sp-templates/sp-templates-add/sp-templates-add-modal/sp-templates-add-modal.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NzTreeModule,
    SharedModule,
    StoreManagementRoutingModule
  ],
  declarations: [StoreListComponent, StoreListModalComponent, StoreAddBasicComponent, StoreAddAreaComponent, StoreAddGoodsComponent, StoreAddSpTemplatesComponent, SpTemplatesAddComponent, SpTemplatesAddModalComponent],
  providers: [StoreManagementService,StoreListService,StoreAddBasicService,StoreAddGoodsService,StoreAddSpTemplatesService,SpTemplatesAddService],
  entryComponents: [StoreListModalComponent,SpTemplatesAddModalComponent]
})
export class StoreManagementModule { }
