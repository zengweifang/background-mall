import { Injectable } from '@angular/core';
import { AjaxService } from '../../../shared/services/ajax.service';
import 'rxjs/add/operator/toPromise';
import { config,service } from '../../../core/core.config';

@Injectable()
export class GoodsListService {
	
	constructor(private ajaxService : AjaxService){}

	//获取用户已购买的可用的套餐列表
	getServiceSubscriptionAvailableList(id):Promise<any>{
		let url = `${service.commonService}/background-manage/serviceSubscription/availableList/${id}`;
		return this.ajaxService.get(url);
	}
	
	getServiceSubscriptionUserItemList(data):Promise<any>{
		let url = `${service.commonService}/background-manage/serviceSubscription/userItemList`;
		return this.ajaxService.post(url,data);
	}

	getroGoodsListService(data):Promise<any>{
		let url = `${service.commonService}/background-manage/porder/findGoodsListPage`;
		return this.ajaxService.post(url,data);
	}

	getGoodsDetail(data):Promise<any>{
		let url = `${service.appBackground}/goods/gooddetail.api`;
		let param = {
			goodId: data.goodId,
			groupNumber: data.groupNumber,
			storeId: data.storeId,
			appId: data.roObj.appId,
		}

		let headers = {
			'Wgj-Position': data.roObj.adcode,
			'location': data.roObj.location
		}
		return this.ajaxService.get(url,{params: param,headers: headers});
	}

	updateAddress(data):Promise<any>{
		let url = `${service.commonService}/background-manage/porder/updateAddress`;
		return this.ajaxService.post(url,data);
	}

	deleteAddrService(data):Promise<any>{
		let url = `${service.commonService}/background-manage/porder/delete/${data}`;
		return this.ajaxService.get(url);
	}

	//去库存接口
	exitOrderSubmitService(data):Promise<any>{
		let url = `${service.appBackground}/order/exitOrderSubmit`;
		return this.ajaxService.post(url,data);
	}

}