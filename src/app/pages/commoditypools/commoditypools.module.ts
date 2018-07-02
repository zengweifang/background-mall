import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FileUploadModule } from 'ng2-file-upload';

import { CommoditypoolsRoutingModule } from "./commoditypools-routing.module";
import { CommoditypoolsListComponent } from "./list/list.component";
import { AddCommoditypoolsComponent } from "./add/add.component";
import { EditCommoditypoolsComponent } from "./edit/edit.component";

import { CommoditypoolsService } from "./commoditypools.service";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        CommoditypoolsRoutingModule,
        FileUploadModule,
        SharedModule
    ],
    declarations: [
        CommoditypoolsListComponent,
        AddCommoditypoolsComponent,
        EditCommoditypoolsComponent
    ],
    entryComponents: [AddCommoditypoolsComponent,EditCommoditypoolsComponent],
    providers: [CommoditypoolsService]
})

export class CommoditypoolsModule { }
