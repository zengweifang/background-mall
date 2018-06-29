import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { HomeManagementRoutingModule } from "./home-management-routing.module";
import { HomeManagementService } from "./home-management.service";
import { HomeCategoriessComponent } from "./home-categories/home-categories.component";
import { AddCategoriessComponent } from "./home-categories/add-categories.component";
import { LinkContentModalComponent } from "./home-categories/link-content-modal.component";
import { ChannelCategoriessComponent } from "./home-categories/channel-categories.component";
import { AddChannelModalComponent } from "./home-categories/add-channel-modal.component";
import { HomeNoticeComponent } from './home-notice/home-notice.component';
import { AddNoticeComponent } from "./home-notice/add-notice.component";
import { CheckNoticeComponent } from "./home-notice/check-notice.component";
import { EditNoticeComponent } from "./home-notice/edit-notice.component";
import { HomeSpecialComponent } from "./home-special/home-special.component";
import { AddSpecialComponent } from "./home-special/add-special.component";
import { CustomCitiesSelectModule } from '../../shared/components/custom-cities-select/custom-cities-select.module';
import { EditCategoriessComponent } from './home-categories/edit-categories.component';
import { EditSpecialComponent } from './home-special/edit-special.component';
import { SharedModule } from '../../shared/shared.module';
import { HomeAdComponent } from './home-ad/home-ad.component';
import { adStatusPipe } from './home-ad/home-ad.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        HomeManagementRoutingModule,
        CustomCitiesSelectModule,
        SharedModule
    ],
    declarations: [
        HomeCategoriessComponent,
        AddCategoriessComponent,
        EditCategoriessComponent,
        LinkContentModalComponent,
        ChannelCategoriessComponent,
        AddChannelModalComponent,
        HomeNoticeComponent,
        AddNoticeComponent,
        CheckNoticeComponent,
        EditNoticeComponent,
        HomeSpecialComponent,
        AddSpecialComponent,
        EditSpecialComponent,
        HomeAdComponent,
        adStatusPipe
    ],
    entryComponents: [
        LinkContentModalComponent,
        AddChannelModalComponent
    ],
    providers: [HomeManagementService]
})

export class HomeManagementModule { }
