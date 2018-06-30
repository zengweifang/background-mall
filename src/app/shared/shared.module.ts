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
import { GoodsTypePipe } from "./pipe/goods.pipe";
import { WoStatusPipe } from "./pipe/woStatus.pipe";
import { CommenPipe } from "./pipe/woStatus.pipe";
import { ServicePeriodPipe } from "./pipe/woStatus.pipe";
import { ApartmentStatusPipe } from "./pipe/apartment.pipe";
import { FloorPipe } from "./pipe/apartment.pipe";
import { StoreStatus } from './pipe/store-management.pipe';
import { StoreServiceTime } from './pipe/store-management.pipe';
import { CustomModalService }  from './services/custom-modal.service';
import { GoBackDirective } from './directive/goback/goback.directive';
import { PageLoadingComponent } from './components/page-loading/page-loading.component';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule
  ],
  
  declarations: [StaticUrl,ImgPipe,SafePipe,CommenPipe,ServicePeriodPipe,remarkFilter,GenderPipe,
    GoodsTypePipe,WoStatusPipe,
    GisStatusPipe,
    StoreStatus,StoreServiceTime,GoBackDirective,ApartmentStatusPipe,FloorPipe,PageLoadingComponent],

  providers: [AjaxService,AccessTokenService,CommonService,
    CanDeactivateGuard,AmapService,CustomModalService],

  entryComponents: [],
  // pipe、directive和component需要导出并且在特性模块中导入SharedModule才能使用
  exports: [StaticUrl,ImgPipe,SafePipe,CommenPipe,ServicePeriodPipe,remarkFilter,
    GenderPipe,GoodsTypePipe,WoStatusPipe,
    GisStatusPipe,StoreStatus,StoreServiceTime,
    GoBackDirective,ApartmentStatusPipe,FloorPipe,PageLoadingComponent]
})
export class SharedModule { }
