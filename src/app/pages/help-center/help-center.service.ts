import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { service, config } from '../../core/core.config';
import { HttpParams } from "@angular/common/http";
import { Http, Headers } from '@angular/http';

@Injectable()
export class HelpCenterService {
	constructor(private ajaxService: AjaxService) { }

	private getDocListAPI = service.commonService + '/background-manage/helpcenter/listHelpDocumentPage';
	private deleteDocAPI = service.commonService + '/background-manage/helpcenter/delete/';
	private getDocDetailAPI = service.commonService + '/background-manage/helpcenter/edit/';
	private saveDocAPI = service.commonService + '/background-manage/helpcenter/saveorupdate';
	private getUseTargetAPI = service.commonService + '/background-manage/helpcenter/listUseTarget';

	private upLoadDocAPI = service.staticUrl + '/helpdoc-upload';

	getDocList(params:any): Promise<any> {
		return this.ajaxService.post(this.getDocListAPI, params)
	}

	deleteDoc(id: string): Promise<any> {
		return this.ajaxService.get(this.deleteDocAPI + id);
	}

	getDocDetail(id: string): Promise<any> {
		return this.ajaxService.get(this.getDocDetailAPI + id);
	}

	saveDoc(params: any): Promise<any> {
		return this.ajaxService.post(this.saveDocAPI, params);
	}

	upLoadDoc(params: any): Promise<any> {
		let headers = new Headers({'Content-Type' :'application/json' });
		return this.ajaxService.post(this.upLoadDocAPI, params)
	}

	getUseTarget(): Promise<any> {
		return this.ajaxService.get(this.getUseTargetAPI);
	}

}