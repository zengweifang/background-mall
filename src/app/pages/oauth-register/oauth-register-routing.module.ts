import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientRegisterComponent } from './client-register/client-register.component';
import { ResourcesRegisterComponent } from './resources-register/resources-register.component';

const routes : Routes = [
    { path: 'list', component: ResourcesRegisterComponent },
    { path: 'oauthClientList', component: ClientRegisterComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OauthRegisterRoutingModule {}