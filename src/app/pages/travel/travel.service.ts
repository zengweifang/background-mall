import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { service, config } from '../../core/core.config';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class TravelService {
	constructor(private ajaxService: AjaxService) { }
	private getBokerOrderListAPI = service.commonService + '/background-manage/broker/getBrokerOrderList';
	private getBokerListAPI = service.commonService + '/background-manage/broker/getBrokerList';

	getBokerOrderList(params:any): Promise<any> {
		return this.ajaxService.post(this.getBokerOrderListAPI, params);
	}

	getBokerList(params:any): Promise<any> {
		return this.ajaxService.post(this.getBokerListAPI, params);
	}
}