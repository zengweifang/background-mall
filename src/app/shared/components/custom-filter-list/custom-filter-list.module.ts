import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CustomFilterListComponent } from "./custom-filter-list.component";
import { CustomTransferListComponent } from "./list/custom-transfer-list.component";
import { CustomTransferSearchComponent } from "./search/custom-transfer-search.component";
import { NzButtonModule, NzCheckboxModule, NzInputModule } from "ng-zorro-antd";

@NgModule({
    imports: [CommonModule, FormsModule, NzButtonModule, NzCheckboxModule, NzInputModule],
    declarations: [CustomFilterListComponent, CustomTransferListComponent, CustomTransferSearchComponent],
    exports: [CustomFilterListComponent]
})

export class CustomFilterListModule {}