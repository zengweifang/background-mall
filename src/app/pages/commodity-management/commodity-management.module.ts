import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedModule } from '../../shared/shared.module';
import { CommodityManagementRoutingModule } from "./commodity-management-routing.module";
import { CommodityManagementService } from "./commodity-management.service";

import { ManagementComponent } from "./management/management.component";
import { GoodEditComponent } from "./good-edit/good-edit.component";
import { TypeAddComponent } from "./type-add/type-add.component";
import { ShelvesComponent } from "./shelves/shelves.component";
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        CommodityManagementRoutingModule,
        SharedModule,
        CKEditorModule
    ],
    declarations: [
        ManagementComponent,
        GoodEditComponent,
        TypeAddComponent,
        ShelvesComponent
    ],
    entryComponents: [
    ],
    providers: [CommodityManagementService]
})

export class CommodityManagementModule { }
