import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TravelAgentComponent } from './travel-agent/travel-agent.component';
import { TravelAgentDetailComponent } from './travel-agent/travel-agent-detail.component';

const routes : Routes = [
    { path: 'travelAgentDetail/:id', component: TravelAgentDetailComponent },
    { path: 'travelAgent', component: TravelAgentComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TravelRoutingModule {}