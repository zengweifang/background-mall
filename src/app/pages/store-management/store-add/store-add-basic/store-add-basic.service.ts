import { Injectable } from '@angular/core';
import { AjaxService } from '../../../../shared/services/ajax.service';
import { config,service } from '../../../../core/core.config';

@Injectable()
export class StoreAddBasicService {
	
	constructor(private ajaxService : AjaxService){}

	create(data):Promise<any>{
		let url = `${service.commonService}/background-manage/store/create`;
		return this.ajaxService.post(url,data);
	}

}