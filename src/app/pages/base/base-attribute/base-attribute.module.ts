
// 特性模块需要引入自身需要的module才能使用
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { BaseAttributeRoutingModule } from './base-attribute-routing.module';
// Component
import { BaseAttributeListComponent } from './base-attribute-list/base-attribute-list.component';
import { BaseAttributeAddComponent } from './base-attribute-add/base-attribute-add.component';


// services
import { BaseService } from './base-attribute.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    BaseAttributeRoutingModule
  ],
  declarations: [BaseAttributeListComponent,BaseAttributeAddComponent],
  providers: [BaseService]
})
export class BaseAttributeModule { }
