import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { TravelRoutingModule } from "./travel-routing.module";
import { TravelService } from "./travel.service";
import { TravelAgentComponent } from "./travel-agent/travel-agent.component";
import { TravelAgentDetailComponent } from './travel-agent/travel-agent-detail.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        TravelRoutingModule
    ],
    declarations: [
        TravelAgentComponent,
        TravelAgentDetailComponent,
    ],
    entryComponents: [
    ],
    providers: [TravelService]
})

export class TravelModule { }
