import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { service, config } from '../../core/core.config';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class ClubsService {
	constructor(private ajaxService: AjaxService) { }

	private getClubsListUrl=service.commonService+"/cubes";
	private addClubsUrl=service.commonService+"/cubes/cube";
	private getClubsInfoUrl = service.commonService+"/cubes/cube";
	private updateClubsUrl = service.commonService+"/cubes/cube";
	private deleteClubsUrl = service.commonService+"/cubes/cube";
	
	

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	};

	//获取Clubs列表
	getCubesList(data):Promise<any>{
		return this.ajaxService.get(this.getClubsListUrl,data);
	}

	//新增
	add(data):Promise<any>{
		return this.ajaxService.post(this.addClubsUrl,data);
	}

	//获取
	getClubsInfo(data):Promise<any>{
		return this.ajaxService.post(this.getClubsInfoUrl,data);
	}

	//更新
	update(data):Promise<any>{
		return this.ajaxService.post(this.updateClubsUrl,data);
	}

	//删除
	delete(data):Promise<any>{
		return this.ajaxService.post(this.deleteClubsUrl,data);
	}
	

	

	
	
	


}