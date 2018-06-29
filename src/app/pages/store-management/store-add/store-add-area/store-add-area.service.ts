import { Injectable } from '@angular/core';
import { AjaxService } from '../../../../shared/services/ajax.service';
import { config,service } from '../../../../core/core.config';

@Injectable()
export class StoreAddAreaService {
	
	constructor(private ajaxService : AjaxService){}

	getStorePolygonAreaList(data):Promise<any>{
		let url = `${service.commonService}/background-manage/store/getStorePolygonAreaList`;
		return this.ajaxService.post(url,data);
	}
	
	updateStoreAreaName(data):Promise<any>{
		let url = `${service.commonService}/background-manage/store/updateStoreAreaName`;
		return this.ajaxService.post(url,{},{
			params: data
		});
	}

	submitAreaVerify(data):Promise<any>{
		let url = `${service.commonService}/background-manage/store/submitAreaVerify`;
		return this.ajaxService.post(url,data);
	}


}