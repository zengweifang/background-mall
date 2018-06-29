import { Injectable } from '@angular/core';
import { AjaxService } from '../../../shared/services/ajax.service';
import 'rxjs/add/operator/toPromise';
import { config,service } from '../../../core/core.config';

@Injectable()
export class CreatOrderService {
	
	constructor(private ajaxService : AjaxService){}

	getOrderService(data):Promise<any>{
		let url = `${service.appBackground}/order/submit/create`;
		return this.ajaxService.post(url,data);
	}
	
	getOrderServiceTimes(data):Promise<any>{
		let url = `${service.appBackground}/order/serviceTimes?processInstanceId=${data}`;
		return this.ajaxService.get(url);
	}

	confirmOrderService(data):Promise<any>{
		let url = `${service.appBackground}/order/submit/confirm`;
		return this.ajaxService.post(url,data);
	}

	

}