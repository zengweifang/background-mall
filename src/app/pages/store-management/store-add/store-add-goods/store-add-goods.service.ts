import { Injectable } from '@angular/core';
import { AjaxService } from '../../../../shared/services/ajax.service';
import { config,service } from '../../../../core/core.config';

@Injectable()
export class StoreAddGoodsService {
	
	constructor(private ajaxService : AjaxService){}

	getGoodsList(data):Promise<any>{
		let url = `${service.commonService}/background-manage/service-provider/goods`;
		return this.ajaxService.post(url,data);
	}

	searchType(data):Promise<any>{
		let url = `${service.commonService}/background-manage/goods-type/names/${data}`;
		return this.ajaxService.get(url);
	}

	addBatchgood(data):Promise<any>{
		let url = `${service.commonService}/background-manage/store/add/batchgood`;
		return this.ajaxService.post(url,data);
	}

}