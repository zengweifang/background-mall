import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { AjaxService } from './services/ajax.service';
import { AccessTokenService } from './services/access-token.service';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { CommonService } from './services/common.service';
import { AmapService } from './services/amap.service';
import { SafePipe } from './pipe/safe.pipe';
import { GisStatusPipe } from './pipe/gis-status.pipe';
import { CustomModalService } from './services/custom-modal.service';
import { GoBackDirective } from './directive/goback/goback.directive';
import { PageLoadingComponent } from './components/page-loading/page-loading.component';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule
  ],

  declarations: [SafePipe,
    GisStatusPipe, GoBackDirective, PageLoadingComponent],

  providers: [AjaxService, AccessTokenService, CommonService,
    CanDeactivateGuard, AmapService, CustomModalService],

  entryComponents: [],
  // pipe、directive和component需要导出并且在特性模块中导入SharedModule才能使用
  exports: [SafePipe,
    GisStatusPipe,
    GoBackDirective, PageLoadingComponent]
})
export class SharedModule { }
