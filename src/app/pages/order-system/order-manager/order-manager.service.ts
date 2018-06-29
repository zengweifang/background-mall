import { Injectable } from '@angular/core';
import { AjaxService } from '../../../shared/services/ajax.service';
import 'rxjs/add/operator/toPromise';
import { config,service } from '../../../core/core.config';

@Injectable()
export class OrderManagerService {
	private channelServiceOrderListUrl = service.commonService +'/background-manage/managerorder/channelOrderList';
	private getMetadataUrl = service.commonService +"/background-manage/managerorder/metadata";
	private getListUrl = `${service.commonService}/background-manage/managerorder/getlist`;
	constructor(private ajaxService : AjaxService){}

	getChannelServiceOrderList(data):Promise<any>{
		return this.ajaxService.post(this.channelServiceOrderListUrl,data);
	}

	metadata():Promise<any>{
		return this.ajaxService.get(this.getMetadataUrl);
	}

	getList(data):Promise<any>{
		return this.ajaxService.post(this.getListUrl,data);
	}

}