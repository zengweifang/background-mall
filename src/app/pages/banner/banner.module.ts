import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FileUploadModule } from 'ng2-file-upload';

import { BannerRoutingModule } from "./banner-routing.module";
import { BannerListComponent } from "./list/list.component";
import { EditBannerComponent } from "./edit/edit.component";
import { AddBannerComponent } from "./add/add.component";

import { BannerService } from "./banner.service";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        BannerRoutingModule,
        FileUploadModule,
        SharedModule
    ],
    declarations: [
        BannerListComponent,
        EditBannerComponent,
        AddBannerComponent
    ],
    entryComponents: [EditBannerComponent,
        AddBannerComponent
    ],
    providers: [BannerService]
})

export class BannerModule { }
