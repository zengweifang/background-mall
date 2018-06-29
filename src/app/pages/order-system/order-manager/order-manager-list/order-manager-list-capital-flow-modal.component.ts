import { Component, OnInit, Input } from '@angular/core';
import { OrderManagerService } from '../order-manager.service';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
@Component({
  selector: 'app-order-manager-list-capital-flow-modal',
  templateUrl: './order-manager-list-capital-flow-modal.component.html',
  styleUrls: ['./order-manager-list-capital-flow-modal.component.scss']
})
export class OrderManagerListCapitalFlowModalComponent implements OnInit {
    _data: any

    _dataSet: any

    @Input()

    set outData(value){
        this._data = value
        
    }

    constructor(private orderManagerService:OrderManagerService) {

    }
    ngOnInit(){
        
    }
}
