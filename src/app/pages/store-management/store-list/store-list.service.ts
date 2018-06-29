import { Injectable } from '@angular/core';
import { AjaxService } from '../../../shared/services/ajax.service';
import 'rxjs/add/operator/toPromise';
import { config,service } from '../../../core/core.config';

@Injectable()
export class StoreListService {
	
	constructor(private ajaxService : AjaxService){}

	getStoreList(data):Promise<any>{
		let url = `${service.commonService}/background-manage/serviceprovider/stores/`;
		return this.ajaxService.post(url,data);
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

	addtoreervicenventoryrules(data):Promise<any>{
		let url = `${service.commonService}/background-manage/serviceinventory/addtoreervicenventoryrules`;
		return this.ajaxService.post(url,data);
	}

	updatetoreervicenventoryrules(data):Promise<any>{
		let url = `${service.commonService}/background-manage/serviceinventory/updatestoreervicenventoryrules`;
		return this.ajaxService.post(url,data);
	}

}