import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CustomTransferComponent } from "./custom-transfer.component";
import { CustomTransferListComponent } from "./list/custom-transfer-list.component";
import { CustomTransferSearchComponent } from "./search/custom-transfer-search.component";
import { NzButtonModule, NzCheckboxModule, NzInputModule } from "ng-zorro-antd";

@NgModule({
    imports: [CommonModule, FormsModule, NzButtonModule, NzCheckboxModule, NzInputModule],
    declarations: [CustomTransferComponent, CustomTransferListComponent, CustomTransferSearchComponent],
    exports: [CustomTransferComponent]
})

export class CustomTransferModule {}