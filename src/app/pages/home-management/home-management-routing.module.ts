import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeCategoriessComponent } from './home-categories/home-categories.component';
import { HomeNoticeComponent } from './home-notice/home-notice.component';
import { AddCategoriessComponent } from './home-categories/add-categories.component';
import { ChannelCategoriessComponent } from './home-categories/channel-categories.component';
import { AddNoticeComponent } from "./home-notice/add-notice.component";
import { CheckNoticeComponent } from "./home-notice/check-notice.component";
import { EditNoticeComponent } from "./home-notice/edit-notice.component";
import { HomeSpecialComponent } from "./home-special/home-special.component";
import { AddSpecialComponent } from "./home-special/add-special.component";
import { EditCategoriessComponent } from './home-categories/edit-categories.component';
import { EditSpecialComponent } from './home-special/edit-special.component';
import { HomeAdComponent } from './home-ad/home-ad.component';

const routes : Routes = [
    { path: 'homeCategories/homeCategories', component: HomeCategoriessComponent },
    { path: 'homeCategories/add', component: AddCategoriessComponent },
    { path: 'homeCategories/edit/:id', component: EditCategoriessComponent },
    { path: 'homeCategories/channel/:id', component: ChannelCategoriessComponent },
    // 公告
    { path: 'list', component: HomeNoticeComponent},
    { path: 'notice/add', component: AddNoticeComponent},
    { path: 'notice/check/:id', component: CheckNoticeComponent},
    { path: 'notice/edit/:id', component: EditNoticeComponent},
    // 专题
    { path: 'homeSpecial/list/list', component: HomeSpecialComponent},
    { path: 'homeSpecial/add', component: AddSpecialComponent},
    { path: 'homeSpecial/edit/:id', component: EditSpecialComponent},
    // 广告
    { path: 'homeAdvertisements/homeAdvertisement', component: HomeAdComponent},

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeManagementRoutingModule {}