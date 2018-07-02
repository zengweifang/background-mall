import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { service, config } from '../../core/core.config';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class BaseService {
	constructor(private ajaxService: AjaxService) { }

	private getBaseListUrl=service.commonService+"/cubes";
	private addBaseUrl=service.commonService+"/cubes/cube";
	private getBaseInfoUrl = service.commonService+"/cubes/cube";
	private updateBaseUrl = service.commonService+"/cubes/cube";
	private deleteBaseUrl = service.commonService+"/cubes/cube";
	
	

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	};

	//获取Base列表
	getCubesList(data):Promise<any>{
		return this.ajaxService.get(this.getBaseListUrl,data);
	}

	//新增
	add(data):Promise<any>{
		return this.ajaxService.post(this.addBaseUrl,data);
	}

	//获取
	getBaseInfo(data):Promise<any>{
		return this.ajaxService.post(this.getBaseInfoUrl,data);
	}

	//更新
	update(data):Promise<any>{
		return this.ajaxService.post(this.updateBaseUrl,data);
	}

	//删除
	delete(data):Promise<any>{
		return this.ajaxService.post(this.deleteBaseUrl,data);
	}
	

	

	
	
	


}