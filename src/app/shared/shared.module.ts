import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { AjaxService }  from './services/ajax.service';
import { AccessTokenService }  from './services/access-token.service';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { CommonService } from './services/common.service';
import { AmapService } from './services/amap.service';
import { ImgPipe } from './pipe/img.pipe';
import { StaticUrl } from './pipe/help-center-pipe';
import { SafePipe } from './pipe/safe.pipe';
import { remarkFilter } from './pipe/order-remark.pipe';
import { GenderPipe } from './pipe/gender.pipe';
import { GisStatusPipe } from './pipe/gis-status.pipe';
import { ShowRemarkComponent } from './components/show-remark/show-remark.component';
import { CancelOrderComponent } from './components/cancel-order/cancel-order.component';
import { CustomTransferModule } from "./components/custom-transfer/custom-transfer.module";
import { CustomFilterListModule } from "./components/custom-filter-list/custom-filter-list.module";
import { GoodsTypePipe } from "./pipe/goods.pipe";
import { WoStatusPipe } from "./pipe/woStatus.pipe";
import { CommenPipe } from "./pipe/woStatus.pipe";
import { ServicePeriodPipe } from "./pipe/woStatus.pipe";
import { ApartmentStatusPipe } from "./pipe/apartment.pipe";
import { FloorPipe } from "./pipe/apartment.pipe";
import { StoreStatus } from './pipe/store-management.pipe';
import { StoreServiceTime } from './pipe/store-management.pipe';
import { PageLoadingComponent } from './components/page-loading/page-loading.component';
import { GisServiceAreaListComponent } from './components/gis-service-area-list/gis-service-area-list.component';
import { FailReasonComponent } from './components/fail-reason/fail-reason.component';
import { CustomModalService }  from './services/custom-modal.service';
import { GoBackDirective } from './directive/goback/goback.directive';
import { GisServiceAreaSearchComponent } from './components/gis-service-area-search/gis-service-area-search.component';
import { SupplierManageService } from '../pages/supplier-manage/supplier-manage.service';
import { StoreAddAreaService } from '../pages/store-management/store-add/store-add-area/store-add-area.service';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    CustomTransferModule,
    CustomFilterListModule,
  ],
  
  declarations: [StaticUrl,ImgPipe,SafePipe,CommenPipe,ServicePeriodPipe,remarkFilter,GenderPipe,
    ShowRemarkComponent, CancelOrderComponent,GoodsTypePipe,WoStatusPipe,
    PageLoadingComponent,GisServiceAreaListComponent,GisStatusPipe,FailReasonComponent,
    StoreStatus,StoreServiceTime, GisServiceAreaSearchComponent,GoBackDirective,ApartmentStatusPipe,FloorPipe],

  providers: [AjaxService,AccessTokenService,CommonService,
    CanDeactivateGuard,AmapService,CustomModalService,SupplierManageService,StoreAddAreaService],

  entryComponents: [FailReasonComponent],
  // pipe、directive和component需要导出并且在特性模块中导入SharedModule才能使用
  exports: [StaticUrl,ImgPipe,SafePipe,CommenPipe,ServicePeriodPipe,remarkFilter,
    GenderPipe,ShowRemarkComponent,CancelOrderComponent,GoodsTypePipe,WoStatusPipe,
    CustomTransferModule, CustomFilterListModule,PageLoadingComponent,
    GisServiceAreaListComponent,GisStatusPipe,StoreStatus,StoreServiceTime,
    GisServiceAreaSearchComponent,GoBackDirective,ApartmentStatusPipe,FloorPipe]
})
export class SharedModule { }
