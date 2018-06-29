import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { HelpCenterRoutingModule } from "./help-center-routing.module";
import { HelpCenterService } from "./help-center.service";
import { DocListComponent } from "./doc-list/list.component";
import { DocEditComponent } from "./doc-edit/edit.component";
import { DocDetailComponent } from "./doc-detail/detail.component";
import { CustomModalService } from '../../shared/services/custom-modal.service';
import { CKEditorModule } from 'ng2-ckeditor';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        CKEditorModule,
        HelpCenterRoutingModule,
        SharedModule
    ],
    declarations: [
        DocListComponent,
        DocEditComponent,
        DocDetailComponent,
    ],
    entryComponents: [
    ],
    providers: [HelpCenterService, CustomModalService]
})

export class HelpCenterModule { }
