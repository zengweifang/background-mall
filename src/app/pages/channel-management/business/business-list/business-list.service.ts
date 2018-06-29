import { Injectable } from '@angular/core';
// import { Http, Headers } from '@angular/http';
import { AjaxService } from '../../../../shared/services/ajax.service';
import { service } from '../../../../core/core.config';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BusinessListService {
	constructor(private ajaxService : AjaxService){}
	private channelListUrl = 'https://development.wang-guanjia.com/background-manage/channel/listPager';
	private addNewChannelAPI = service.commonService + '/background-manage/channel/save';

	getChannelList(data):Promise<any>{
		return this.ajaxService.post(this.channelListUrl,data)
	}

	addNewChannel(params:any): Promise<any> {
		return this.ajaxService.post(this.addNewChannelAPI, params);
	}

}
