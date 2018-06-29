import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NzTreeModule } from 'ng-tree-antd';
import { CustomCitiesSelectComponent } from "./custom-cities-select.component";



@NgModule({
    imports: [CommonModule, FormsModule, NzTreeModule],
    declarations: [
        CustomCitiesSelectComponent
    ],
    exports: [CustomCitiesSelectComponent]
})

export class CustomCitiesSelectModule {};

