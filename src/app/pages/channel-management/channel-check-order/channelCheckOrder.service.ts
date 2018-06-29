import { Injectable } from '@angular/core';
// import { Http, Headers } from '@angular/http';
import { AjaxService } from '../../../shared/services/ajax.service';
import 'rxjs/add/operator/toPromise';
import { config,service } from '../../../core/core.config';

@Injectable()
export class ChannelCheckOrderService {
	// private headers = new Headers({'Content-Type' :'application/json' });
	private channelServiceOrderListUrl = service.commonService +'/background-manage/managerorder/channelOrderList';
	private getMetadataUrl = service.commonService +"/background-manage/managerorder/metadata";
	// private deleteUrl=this.url.url+'/background-manage/attribute/delete?id=';
	// private addUrl=this.url.url+"/background-manage/attribute/save";
	constructor(private ajaxService : AjaxService){}

	// private handleError(error:any):Promise<any>{
	// 	return Promise.reject(error.message || error)
	// }

	getChannelServiceOrderList(data):Promise<any>{
		return this.ajaxService.post(this.channelServiceOrderListUrl,data);
	}

	metadata():Promise<any>{
		return this.ajaxService.get(this.getMetadataUrl);
	}

	// deleteBaseData(data):Promise<void>{
	// 	const url = `${this.deleteUrl}${data.id}`;
	// 	return this.http
	// 		.post(url,{headers:this.headers})
	// 		.toPromise()
	// 		.then(() => null)
	// 		.catch(this.handleError);
	// }

	// saveBaseData(data):Promise<any>{
	// 	return this.http
	// 		.post(this.addUrl,JSON.stringify(data),{headers:this.headers})
	// 		.toPromise()
	// 		.then(response => response.json().data as any)
	// 		.catch(this.handleError)
	// }
}