import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { OauthRegisterRoutingModule } from "./oauth-register-routing.module";
import { OauthRegisterService } from "./oauth-register.service";

import { ClientRegisterComponent } from "./client-register/client-register.component";
import { ClientRegisterAddModalComponent } from "./client-register/client-register-add-modal.component";
import { ClientRegisterUpdateModalComponent } from "./client-register/client-register-update-modal.component";

import { ResourcesRegisterComponent } from "./resources-register/resources-register.component";
import { ResoursesRegisterAddModalComponent } from "./resources-register/resourses-register-add-modal.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        OauthRegisterRoutingModule
    ],
    declarations: [
        ClientRegisterComponent,
        ClientRegisterAddModalComponent,
        ClientRegisterUpdateModalComponent,

        ResourcesRegisterComponent,
        ResoursesRegisterAddModalComponent,
    ],
    entryComponents: [
        ClientRegisterAddModalComponent,
        ClientRegisterUpdateModalComponent,
        ResoursesRegisterAddModalComponent,
    ],
    providers: [OauthRegisterService]
})

export class OauthRigisterModule { }
