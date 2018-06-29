import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthorityRoutingModule } from './authority-routing.module';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { AuthComponent } from './auth/auth.component';
import { AuthorityService } from "./authority.service";
import { RoleEditModalComponent } from "./role/edit-role-modal.component";
import { UserEditModalComponent } from "./user/edit-user-modal.component";

@NgModule({
  imports: [
    CommonModule,
    AuthorityRoutingModule,
    FormsModule,
    ReactiveFormsModule,    
    NgZorroAntdModule
  ],
  declarations: [UserComponent, RoleComponent ,RoleEditModalComponent,UserEditModalComponent,AuthComponent],
  entryComponents: [
    RoleEditModalComponent,
    UserEditModalComponent
  ],  
  providers: [AuthorityService]
})
export class AuthorityModule { }
