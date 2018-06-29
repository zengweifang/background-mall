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
  path: 'basicData/attribute/list',
  loadChildren: 'app/pages/base/base-attribute/base-attribute.module#BaseAttributeModule'
},{
  path: 'channelManagement/channelCheckOrder',
  loadChildren: 'app/pages/channel-management/channel-check-order/channel-check-order.module#ChannelCheckOrderModule'
},{
  path: 'channelManagement/business',
  loadChildren: 'app/pages/channel-management/business/business.module#BusinessModule'
}, {
  path: 'oauthRegister/clientRegister',
  loadChildren: 'app/pages/oauth-register/oauth-register.module#OauthRigisterModule'
}, {
  path: 'oauthRegister/list',
  loadChildren: 'app/pages/oauth-register/oauth-register.module#OauthRigisterModule'
}, {
  path: 'channelManagement/sendOrders',
  loadChildren: 'app/pages/channel-management/send-order/send-order.module#SendOrderModule'
}, {
path: 'channelManagement/operation',
  loadChildren: 'app/pages/channel-management/operation/operation-list.module#OperationListModule'
}, {
  path: 'channelManagement/channelOrder',
  loadChildren: 'app/pages/channel-management/operation/operation-list.module#OperationListModule'
}, {
  path: 'commodityManagement',
  loadChildren: 'app/pages/commodity-management/commodity-management.module#CommodityManagementModule'
},{
  path: 'apartment',
  loadChildren: 'app/pages/apartment/apartment.module#ApartmentModule'
}, {
  path: 'woManagement',
  loadChildren: 'app/pages/apartment/apartment.module#ApartmentModule'
},{
  path: 'commodityManagement',
  loadChildren: 'app/pages/goods/goods.module#GoodsModule'
},{  
  path: 'authority',
  loadChildren: 'app/pages/authority/authority.module#AuthorityModule'
},{
  path: 'orderSystem/orderManager',
  loadChildren: 'app/pages/order-system/order-manager/order-manager.module#OrderManagerModule'
},{
  path: 'supplierManage',
  loadChildren: 'app/pages/supplier-manage/supplier-manage.module#SupplierManageModule'
},{
  path: 'travel/travelAgent',
  loadChildren: 'app/pages/travel/travel.module#TravelModule'
},{
  path: 'helpCenter',
  loadChildren: 'app/pages/help-center/help-center.module#HelpCenterModule'
},{
  path: 'homeManagement',
  loadChildren: 'app/pages/home-management/home-management.module#HomeManagementModule'
},{
  path: 'noticeManagement',
  loadChildren: 'app/pages/home-management/home-management.module#HomeManagementModule'
},{
  path: 'representingOrder',
  loadChildren: 'app/pages/represent-order/represent-order.module#RepresentOrderModule'
},{
  path: 'storeManagement',
  loadChildren: 'app/pages/store-management/store-management.module#StoreManagementModule'
},{
  path: 'login',
  component: LoginComponent
},{
  path: '',
  redirectTo: '/channelManagement/channelCheckOrder/channelServiceOrderList',
  pathMatch: 'full'
}];




@NgModule({
	imports : [RouterModule.forRoot(routes)],
	exports : [RouterModule]
})

export class AppRoutingModule {}