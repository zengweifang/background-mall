import { Injectable } from '@angular/core';
import { AjaxService } from '../../../shared/services/ajax.service';
import 'rxjs/add/operator/toPromise';
import { config,service } from '../../../core/core.config';

@Injectable()
export class OrderMsgService {
	
	constructor(private ajaxService : AjaxService){}

	getChannelList():Promise<any>{
		let url = `${service.commonService}/background-manage/channel/listAll`;
		return this.ajaxService.post(url);
	}
	
	creatUserService(data):Promise<any>{
		let url = `${service.appBackground}/users/channelUserLogin.api`;
		return this.ajaxService.post(url,data);
	}

	getAddrList(data):Promise<any>{
		let url = `${service.commonService}/background-manage/porder/findDeliveryAddressByPhone?phone=${data}`;
		return this.ajaxService.get(url);
	}

	addAddress(data):Promise<any>{
		let url = `${service.commonService}/background-manage/porder/addAddress`;
		return this.ajaxService.post(url,data);
	}

	updateAddress(data):Promise<any>{
		let url = `${service.commonService}/background-manage/porder/updateAddress`;
		return this.ajaxService.post(url,data);
	}

	deleteAddrService(data):Promise<any>{
		let url = `${service.commonService}/background-manage/porder/delete/${data}`;
		return this.ajaxService.get(url);
	}

}