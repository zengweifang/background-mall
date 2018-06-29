import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedModule } from '../shared/shared.module'
// services
import { SiderService } from './sider/sider.service';

// pipes
import { SiderPipe } from './sider/sider.pipe';
import { UrlPipe } from './sider/siderUrl.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  declarations: [SiderPipe,UrlPipe],
  providers: [SiderService],
  exports: [SiderPipe,UrlPipe]
})
export class LayoutModule { }
