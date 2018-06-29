import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { GoodsRoutingModule } from "./goods-routing.module";
import { SharedModule } from "../../shared/shared.module";

import { GoodsReviewListComponent } from "./review/review.component";
import { GoodsReviewService } from "./goods.service";
import { GoodsReviewDetailComponent } from "./review-detail/review-detail.component";

import { DisReviewModalComponent } from "./review-modal/dis-review-modal.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        GoodsRoutingModule,
        SharedModule
    ],
    declarations: [
        GoodsReviewListComponent,
        GoodsReviewDetailComponent,
        DisReviewModalComponent
    ],
    entryComponents: [DisReviewModalComponent],
    providers: [GoodsReviewService]
})

export class GoodsModule { }
