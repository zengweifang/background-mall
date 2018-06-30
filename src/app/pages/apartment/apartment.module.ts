import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FileUploadModule } from 'ng2-file-upload';

import { ApartmentRoutingModule } from "./apartment-routing.module";
import { ApartmentListComponent } from "./list/list.component";
import { EditApartmentModalComponent } from "./edit/editModal.component";
import { AddApartmentModalComponent } from "./add/addModal.component";

import { ApartmentService } from "./apartment.service";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        ApartmentRoutingModule,
        FileUploadModule,
        SharedModule
    ],
    declarations: [
        ApartmentListComponent,
        EditApartmentModalComponent,
        AddApartmentModalComponent
    ],
    entryComponents: [EditApartmentModalComponent,
        AddApartmentModalComponent
    ],
    providers: [ApartmentService]
})

export class ApartmentModule { }
