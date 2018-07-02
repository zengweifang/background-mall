import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { service, config } from '../../core/core.config';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class BannerService {
	constructor(private ajaxService: AjaxService) { }

	private getBannerListUrl=service.commonService+"/banners";
	private addBannerUrl=service.commonService+"/banners";
	private getBannerInfoUrl = service.commonService+"/banners/banner";
	private updateUrl = service.commonService+"/banners/banner";
	private deleteUrl = service.commonService+"/banners/banner";
	
	

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	};

	//获取banner列表
	getBannerList(data):Promise<any>{
		return this.ajaxService.get(this.getBannerListUrl,{params:data});
	}

	//新增
	add(data):Promise<any>{
		return this.ajaxService.post(this.addBannerUrl,data);
	}

	//获取
	getBannerInfo(data):Promise<any>{
		return this.ajaxService.post(this.getBannerInfoUrl,data);
	}

	//更新
	update(data):Promise<any>{
		return this.ajaxService.post(this.updateUrl,data);
	}

	//删除
	delete(data):Promise<any>{
		return this.ajaxService.post(this.deleteUrl,data);
	}
	

	

	
	
	


}