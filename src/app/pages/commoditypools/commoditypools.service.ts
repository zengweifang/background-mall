import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { service, config } from '../../core/core.config';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class CommoditypoolsService {
	constructor(private ajaxService: AjaxService) { }

	private getCommoditypoolsListUrl=service.commonService+"/cubes";
	private addCommoditypoolsUrl=service.commonService+"/cubes/cube";
	private getCommoditypoolsInfoUrl = service.commonService+"/cubes/cube";
	private updateCommoditypoolsUrl = service.commonService+"/cubes/cube";
	private deleteCommoditypoolsUrl = service.commonService+"/cubes/cube";
	
	

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	};

	//获取Commoditypools列表
	getCubesList(data):Promise<any>{
		return this.ajaxService.get(this.getCommoditypoolsListUrl,data);
	}

	//新增
	add(data):Promise<any>{
		return this.ajaxService.post(this.addCommoditypoolsUrl,data);
	}

	//获取
	getCommoditypoolsInfo(data):Promise<any>{
		return this.ajaxService.post(this.getCommoditypoolsInfoUrl,data);
	}

	//更新
	update(data):Promise<any>{
		return this.ajaxService.post(this.updateCommoditypoolsUrl,data);
	}

	//删除
	delete(data):Promise<any>{
		return this.ajaxService.post(this.deleteCommoditypoolsUrl,data);
	}
	

	

	
	
	


}