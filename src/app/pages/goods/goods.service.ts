import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { service, config } from '../../core/core.config';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class GoodsReviewService {
	constructor(private ajaxService: AjaxService) { }
    private goodsReviewUrl = service.commonService +'/background-manage/review/goods';
	private batchReviewUrl = service.commonService+'/background-manage/review/batchreview';
	private preVerifyViewUrl = service.commonService+'/background-manage/goods/preVerifyView';
	private getCommodityInfoAPI = service.commonService + '/background-manage/goods/edit';
	private reviewLogsUrl=service.commonService+'/background-manage/review/logs';
	private doreviewUrl = service.commonService+'/background-manage/review/doreview';

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	};

	/**
	 * 商品相关接口
	 */

	//获取审核商品
	goodsReview(data):Promise<any>{
		return this.ajaxService.post(this.goodsReviewUrl,data);
	}
	
	getCommodityInfo(goodId:string): Promise<any> {
		const params = new HttpParams().set('goodsId', goodId);
		return this.ajaxService.get(this.getCommodityInfoAPI, {params: params});
	}
    
    //批量审核通过
    batchReview(data):Promise<any>{
		return this.ajaxService.post(this.batchReviewUrl,data);
	}
	
	//获取商品详情
	preVerifyView(goodsId):Promise<any>{
		return this.ajaxService.get(this.preVerifyViewUrl,{params : new HttpParams().set('goodsId',goodsId)});
	}

	//历史记录
	reviewLogs(data):Promise<any>{
		return this.ajaxService.post(this.reviewLogsUrl,data);
	}

	//审核
	doreview(data):Promise<any>{
		return this.ajaxService.post(this.doreviewUrl,data);
	}
    
    

}