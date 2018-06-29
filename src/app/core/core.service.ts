import { Injectable } from "@angular/core";
import {  } from "module";
import { AjaxService } from '../shared/services/ajax.service';
import { service, config } from './core.config';

@Injectable()
export class CoreService {
    constructor(private ajaxService: AjaxService) { }
	private getMetadataUrl = service.commonService +"/background-manage/managerorder/metadata";
	private getRegionUrl = service.commonService+"/background-manage/administrative-region/list";

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
    };
    
    //获取下拉框数据
	getMetadata(data):Promise<any>{
		return this.ajaxService.post(this.getMetadataUrl,data);
	}

	//获取所有的省份
	getRegion(data):Promise<any>{
		return this.ajaxService.post(this.getRegionUrl,data);
	}
	
}