import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelCheckOrderComponent } from './channel-check-order.component';

const routes : Routes = [
    { path: 'channelServiceOrderList', component: ChannelCheckOrderComponent }
]

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class ChannelCheckOrderRoutingModule {}