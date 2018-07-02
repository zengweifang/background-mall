import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FileUploadModule } from 'ng2-file-upload';

import { BaseRoutingModule } from "./base-routing.module";
import { BaseListComponent } from "./list/list.component";
import { AddBaseComponent } from "./add/add.component";
import { EditBaseComponent } from "./edit/edit.component";

import { BaseService } from "./base.service";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        BaseRoutingModule,
        FileUploadModule,
        SharedModule
    ],
    declarations: [
        BaseListComponent,
        AddBaseComponent,
        EditBaseComponent
    ],
    entryComponents: [AddBaseComponent,EditBaseComponent],
    providers: [BaseService]
})

export class BaseModule { }
