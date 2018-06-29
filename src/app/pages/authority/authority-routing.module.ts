import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleComponent } from "./role/role.component";
import { UserComponent } from './user/user.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
 { path: 'roleManage', component: RoleComponent },
 { path: 'userManage', component: UserComponent },
 { path: 'grantManage', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorityRoutingModule { }
