import { BrowserModule} from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule,NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule,NZ_MESSAGE_CONFIG } from 'ng-zorro-antd';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from "@ngrx/store";
// 引入core.module
import { CoreModule } from './core/core.module';
// 引入shared.module
import { SharedModule } from './shared/shared.module';
// 引入layout.module
import { LayoutModule } from './layout/layout.module';

// 引入pages下module
import { ChannelCheckOrderModule } from './pages/channel-management/channel-check-order/channel-check-order.module';
import { BusinessModule } from './pages/channel-management/business/business.module';
import { ApartmentModule } from "./pages/apartment/apartment.module";
import { GoodsModule } from "./pages/goods/goods.module";
import { AuthorityModule } from "./pages/authority/authority.module";

import { AppComponent } from './app.component';
import { SiderComponent } from './layout/sider/sider.component';
import { ModalTextComponent } from './pages/base/base-attribute/modalText.component';
import { LoginComponent } from './pages/login/login.component';

// 引入工具类
import { CodeHelperService } from "./core/code-helper.service";
import { ValidatorService } from "./core/validator.service";
import { CoreService } from "./core/core.service";


import { LOCALE_ID } from '@angular/core';
import { LoginService } from './pages/login/login.service';

// 引入reducer
import { login } from './shared/reducer/login';
import { pageLoading } from './shared/reducer/page-load';
@NgModule({
  declarations: [
    AppComponent,
    SiderComponent,
    ModalTextComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    NgZorroAntdModule.forRoot(),
    StoreModule.forRoot({ login: login,pageLoading: pageLoading}),
    CoreModule,
    SharedModule,
    LayoutModule,
    ChannelCheckOrderModule,
    BusinessModule,
    ApartmentModule,
    GoodsModule,
    AuthorityModule
  ],

  providers: [{provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000 }},LoginService,CodeHelperService,ValidatorService,CoreService],

  bootstrap: [AppComponent],
  entryComponents:[ModalTextComponent]
})
export class AppModule { }
