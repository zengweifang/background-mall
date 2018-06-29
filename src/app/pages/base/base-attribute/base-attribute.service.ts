import { Injectable } from '@angular/core';
// import { Http, Headers } from '@angular/http';
import { AjaxService } from '../../../shared/services/ajax.service';
import 'rxjs/add/operator/toPromise';
import { Base } from './base-attribute';
import { config,service } from '../../../core/core.config';

@Injectable()
export class BaseService {
	// private headers = new Headers({'Content-Type' :'application/json' });
	private dataBaseUrl = service.commonService +'/background-manage/attribute/listPager';
	private deleteUrl= service.commonService +'/background-manage/attribute/delete?id=';
	private addUrl= service.commonService +"/background-manage/attribute/save";
	constructor(private ajaxService : AjaxService){}

	// private handleError(error:any):Promise<any>{
	// 	return Promise.reject(error.message || error)
	// }

	getBaseData(data):Promise<any>{
		return this.ajaxService.post(this.dataBaseUrl,data)
	}

	deleteBaseData(data):Promise<void>{
		const url = `${this.deleteUrl}${data.id}`;
		return this.ajaxService.post(url,data)
	}

	saveBaseData(data):Promise<any>{
		return this.ajaxService.post(this.addUrl,data)
	}
}