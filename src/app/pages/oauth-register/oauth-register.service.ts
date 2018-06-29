import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { service, config } from '../../core/core.config';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class OauthRegisterService {
	constructor(private ajaxService: AjaxService) { }
	private clientListAPI = service.resourceService + '/resource-server/client/page';
	private clientGetGrantTypesAPI = service.resourceService + '/resource-server/grant_type/list';
	private clientGetAuthorityListAPI = service.resourceService + '/resource-server/authority/list';
	private clientRegisterAPI = service.resourceService + '/resource-server/client/register';
	private clientDeleteAPI = service.resourceService + '/resource-server/client/:id/delete';
	private clientUpdateAPI = service.resourceService + '/resource-server/client/update/:id';

	private resourseListAPI = service.resourceService + '/resource-server/resource/page';
	private resourseRigisterAPI = service.resourceService + '/resource-server/resource/register';
	private resourseDeleteAPI = service.resourceService + '/resource-server/resource/:id/delete';

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	};

	/* Client */
	getOAuthClientList(currentPage: Number, pageSize: Number, searchName: any): Promise<any> {
		const hParams = new HttpParams().set('clientName', searchName)
			.set('pageNum', currentPage + '')
			.set('pageSize', pageSize + '');
		return this.ajaxService.get(this.clientListAPI, {
			params: hParams
		});
	}

	getGrantTypes(params: any): Promise<any> {
		return this.ajaxService.get(this.clientGetGrantTypesAPI);
	}

	getAuthorityList(params: any): Promise<any> {
		return this.ajaxService.get(this.clientGetAuthorityListAPI);
	}

	registerClient(params: any): Promise<any> {
		return this.ajaxService.post(this.clientRegisterAPI, params);
	}

	deleteClient(params: any): Promise<any> {
		return this.ajaxService.post(this.clientDeleteAPI.replace(':id', params.clientId));
	}

	updateClient(params: any): Promise<any> {
		return this.ajaxService.post(this.clientUpdateAPI.replace(':id', params.clientId), params);
	}


	/* resourse */
	getOAuthResourseList(params: any): Promise<any> {
		const hParams = new HttpParams().set('name', (params ? params.name : ''))
			.set('alias', (params ? params.alias : ''))
			.set('pageNum', (params ? params.currentPage : ''))
			.set('pageSize', (params ? params.pageSize : ''))

		return this.ajaxService.get(this.resourseListAPI, {
			params: hParams
		});
	}

	registerResourse(params: any): Promise<any> {
		return this.ajaxService.post(this.resourseRigisterAPI, params);
	}
	
	deleteResourse(params: any): Promise<any> {
		return this.ajaxService.post(this.resourseDeleteAPI.replace(':id', params.id), params);
	}
}