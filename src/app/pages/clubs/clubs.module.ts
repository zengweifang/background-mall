import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FileUploadModule } from 'ng2-file-upload';

import { ClubsRoutingModule } from "./clubs-routing.module";
import { ClubsListComponent } from "./list/list.component";
import { AddClubsComponent } from "./add/add.component";
import { EditClubsComponent } from "./edit/edit.component";

import { ClubsService } from "./clubs.service";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        ClubsRoutingModule,
        FileUploadModule,
        SharedModule
    ],
    declarations: [
        ClubsListComponent,
        AddClubsComponent,
        EditClubsComponent
    ],
    entryComponents: [AddClubsComponent,EditClubsComponent],
    providers: [ClubsService]
})

export class ClubsModule { }
