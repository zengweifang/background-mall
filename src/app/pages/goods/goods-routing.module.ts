import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoodsReviewListComponent } from "./review/review.component";
import { GoodsReviewDetailComponent } from "./review-detail/review-detail.component";

const routes : Routes = [
    { path: 'custom/auditing/11', component: GoodsReviewListComponent },
    { path: 'goods/review-detail/:goodsId/:isEdit', component: GoodsReviewDetailComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GoodsRoutingModule {}