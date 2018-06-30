import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { service, config } from '../../core/core.config';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class CategoryService {
	constructor(private ajaxService: AjaxService) { }

	private getCategoryListUrl=service.commonService+"/cubes";
	private addCategoryUrl=service.commonService+"/cubes/cube";
	private getCategoryInfoUrl = service.commonService+"/cubes/cube";
	private updateCategoryUrl = service.commonService+"/cubes/cube";
	private deleteCategoryUrl = service.commonService+"/cubes/cube";
	
	

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	};

	//获取Category列表
	getCubesList(data):Promise<any>{
		return this.ajaxService.get(this.getCategoryListUrl,data);
	}

	//新增
	add(data):Promise<any>{
		return this.ajaxService.post(this.addCategoryUrl,data);
	}

	//获取
	getCategoryInfo(data):Promise<any>{
		return this.ajaxService.post(this.getCategoryInfoUrl,data);
	}

	//更新
	update(data):Promise<any>{
		return this.ajaxService.post(this.updateCategoryUrl,data);
	}

	//删除
	delete(data):Promise<any>{
		return this.ajaxService.post(this.deleteCategoryUrl,data);
	}
	

	

	
	
	


}