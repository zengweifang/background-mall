import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component'
// import { BaseComponent } from './base/base.component';
// import { ChannelComponent } from './channel/channel.component';
// import { BaseAddComponent } from './base/baseAdd.component';
// import { ChannelAddComponent } from './channel/channelAdd.component';
// import { ChannelCheckOrderComponent } from "./channel/channelCheckOrder/channelCheckOrder.component";

// const routes : Routes = [
// 	{ path:'', redirectTo:'basicData/attribute/list/list',pathMatch:'full'},
// 	{ path:'basicData/attribute/list/list' ,component:BaseComponent },
// 	{ path:'channelManagement/business/list' ,component:ChannelComponent },
// 	{ path:'base/baseAdd' ,component:BaseAddComponent },
// 	{ path:'channel/channelAdd',component:ChannelAddComponent},
// 	{ path:'channelManagement/channelCheckOrder/channelServiceOrderList',component:ChannelCheckOrderComponent}
// ]

const routes : Routes = [{
  path: 'apartment',
  loadChildren: 'app/pages/apartment/apartment.module#ApartmentModule'
},
{
  path: 'clubs',
  loadChildren: 'app/pages/clubs/clubs.module#ClubsModule'
},
{
  path: 'category',
  loadChildren: 'app/pages/category/category.module#CategoryModule'
},{
  path: 'login',
  component: LoginComponent
},{
  path: '',
  redirectTo: '/apartment/list/list',
  pathMatch: 'full'
}];



@NgModule({
	imports : [RouterModule.forRoot(routes)],
	exports : [RouterModule]
})

export class AppRoutingModule {}