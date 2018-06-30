import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FileUploadModule } from 'ng2-file-upload';

import { CategoryRoutingModule } from "./category-routing.module";
import { CategoryListComponent } from "./list/list.component";
import { AddCategoryComponent } from "./add/add.component";
import { EditCategoryComponent } from "./edit/edit.component";

import { CategoryService } from "./category.service";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        CategoryRoutingModule,
        FileUploadModule,
        SharedModule
    ],
    declarations: [
        CategoryListComponent,
        AddCategoryComponent,
        EditCategoryComponent
    ],
    entryComponents: [AddCategoryComponent,EditCategoryComponent],
    providers: [CategoryService]
})

export class CategoryModule { }
