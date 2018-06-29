import { Injectable } from '@angular/core';
import { AjaxService } from '../../../shared/services/ajax.service';
import { service, config } from '../../../core/core.config';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class SendOrderService {
	constructor(private ajaxService: AjaxService) { }

	private orderConfigListAPI = service.commonService + '/background-manage/channel/order-config/list';
	private updateOrderConfigAPI = service.commonService + '/background-manage/channel/order-config/update';
	private deleteCityAPI = service.commonService + '/background-manage/service-provider/removeProviderInOrderDistribution';
	private supplierListAPI = service.commonService + '/background-manage/service-provider/list';
	private addProviderInOrderAPI = service.commonService + '/background-manage/service-provider/addProviderInOrderDistribution';

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	};

    /* list */
    getOrderConfigList(params:any): Promise<any> {
        return this.ajaxService.post(this.orderConfigListAPI, params);
	}
	
	updateOrderConfig(params:any): Promise<any> {
		return this.ajaxService.post(this.updateOrderConfigAPI, params);
	}

	deleteCity(params:any): Promise<any> {
		return this.ajaxService.post(this.deleteCityAPI, params);
	}

	// 获取供应商列表
	getSupplierList(params:any): Promise<any> {
		return this.ajaxService.post(this.supplierListAPI, params);
	}

	addProviderInOrder(params: any): Promise<any> {
		return this.ajaxService.post(this.addProviderInOrderAPI, params);
	}
}