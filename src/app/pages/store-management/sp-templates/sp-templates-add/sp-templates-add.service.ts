import { Injectable } from '@angular/core';
import { AjaxService } from '../../../../shared/services/ajax.service';
import { config,service } from '../../../../core/core.config';

@Injectable()
export class SpTemplatesAddService {
	
	constructor(private ajaxService : AjaxService){}

	createTemplate(data):Promise<any>{
		let url = `${service.commonService}/background-manage/freight/create`;
		return this.ajaxService.post(url,data);
	}

	

}