import { Injectable } from '@angular/core';
import { AjaxService } from '../../../../shared/services/ajax.service';
import { config,service } from '../../../../core/core.config';

@Injectable()
export class StoreAddSpTemplatesService {
	
	constructor(private ajaxService : AjaxService){}
	//获取运费模版列表信息
	spTemplatesList(data):Promise<any>{
		let url = `${service.commonService}/background-manage/freight/listPager`;
		return this.ajaxService.post(url,data);
	}

	searchType(data):Promise<any>{
		let url = `${service.commonService}/background-manage/goods-type/names/${data}`;
		return this.ajaxService.get(url);
	}

	addBatchgood(data):Promise<any>{
		let url = `${service.commonService}/background-manage/store/add/batchgood`;
		return this.ajaxService.post(url,data);
	}

	update(data):Promise<any>{
		let url = `${service.commonService}/background-manage/store/update`;
		return this.ajaxService.post(url,data);
	}

	//设置运费模版
	setGoodsFreightTemplateRel(data):Promise<any>{
		let url = `${service.commonService}/background-manage/freight/setGoodsFreightTemplateRel`;
		return this.ajaxService.post(url,data);
	}
}