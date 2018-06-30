import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { service, config } from '../../core/core.config';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class ApartmentService {
	constructor(private ajaxService: AjaxService) { }
	private apartmentListUrl = service.commonService +'/background-manage/apartment/listByPage';
	private housingListUrl = service.commonService +'/background-manage/apartmentResource/listByPage';
	private deleteUrl = service.commonService + '/background-manage/apartmentResource/batchRemove';
	private getApartmentDetailUrl = service.commonService+'/background-manage/apartment/editor';
	private saveApartmentDetailUrl = service.commonService+'/background-manage/apartment/update';
	private addApartmentUrl = service.commonService+'/background-manage/apartment/save';
	private addHousingUrl = service.commonService+'/background-manage/apartmentResource/save';
	private getHousingDetailUrl = service.commonService+'/background-manage/apartmentResource/look';
	private saveHousingUrl = service.commonService+'/background-manage/apartmentResource/update';
	private getWorkOrderListUrl = service.commonService+'/background-manage/apartment/work-order/listByPage';
	private getWorkOrderDetailUrl = service.commonService+'/background-manage/apartment/work-order/viewDetail';
	private rejectWorkOrderUrl = service.commonService+'/background-manage/apartment/work-order/reject';
	private getSkuListUrl = service.commonService+'/background-manage/apartment/work-order/listSkuByPage';
	private saveWorkOrderUrl = service.commonService+'/background-manage/apartment/work-order/submit';
	private preSenderOrderUrl=service.commonService+'/background-manage/apartment/work-order/preSenderOrder';
	private listGoodsRelByPageUrl=service.commonService+'/background-manage/apartment/work-order/listGoodsRelByPage';
	private senderOrderUrl = service.commonService+"/background-manage/apartment/work-order/senderOrder";
	private cancelServicePeriodUrl = service.commonService+"/background-manage/apartment/work-order/cancelServicePeriod";
	private satistyUrl=service.commonService+"/background-manage/order-comment/comment";

	private getBannerListUrl=service.commonService+"/banners";
	

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	};

	/**
	 * 公寓相关接口
	 */

	//获取公寓列表
	getApartmentList(data):Promise<any>{
		return this.ajaxService.post(this.apartmentListUrl,data);
	}

	//获取公寓详情
	getApartmentDetail(id):Promise<any>{
		return this.ajaxService.get(this.getApartmentDetailUrl,{params: new HttpParams().set('id',id)});
	}

	//新增公寓
	addApartment(data):Promise<void>{
		return this.ajaxService.post(this.addApartmentUrl,data);
	}

	//更新公寓
	saveApartmentDetail(data):Promise<void>{
		return this.ajaxService.post(this.saveApartmentDetailUrl,data);
	}

	/**
	 * 房源相关接口
	 */

	//获取房源列表
	getHousingList(data):Promise<any>{
		return this.ajaxService.post(this.housingListUrl,data);
	}

	//获取房源详情
	getHousingDetail(id):Promise<any>{
		return this.ajaxService.get(this.getHousingDetailUrl,{params:new HttpParams().set('resourceId',id)});
	}

	//新增房源
	addHousing(data):Promise<void>{
		return this.ajaxService.post(this.addHousingUrl,data);
	}

	//更新房源
	saveHousing(data):Promise<void>{
		return this.ajaxService.post(this.saveHousingUrl,data);
	}

	//删除房源
	deleteHousing(data):Promise<any>{
		return this.ajaxService.post(this.deleteUrl,data);
	}

	/**
	 * 商务工单相关接口
	 */
	
	//获取商务工单列表
	getWorkOrderList(data):Promise<any>{
		return this.ajaxService.post(this.getWorkOrderListUrl,data);
	}
	
	//获取商务工单详情
	getWorkOrderDetail(id):Promise<any>{
		return this.ajaxService.post(this.getWorkOrderDetailUrl,{},{params:new HttpParams().set('id',id)});
	}

	//撤回工单
	rejectWorkOrder(data):Promise<any>{
		return this.ajaxService.post(this.rejectWorkOrderUrl,data);
	}

	//新增工单获取sku
	getSkuList(data):Promise<any>{
		return this.ajaxService.post(this.getSkuListUrl,data);
	}

	//新增工单
	saveWorkOrder(data):Promise<any>{
		return this.ajaxService.post(this.saveWorkOrderUrl,data);
	}

	/**
	 * 派单
	 */
	//获取当前订单信息
	preSenderOrder(ids):Promise<any>{
		return this.ajaxService.post(this.preSenderOrderUrl,{},{params:new HttpParams().set('ids',ids)});
	}

	//获取真实商品
	listGoodsRelByPage(data):Promise<any>{
		return this.ajaxService.post(this.listGoodsRelByPageUrl,data);
	}
	
	//派单
	senderOrder(data):Promise<any>{
		return this.ajaxService.post(this.senderOrderUrl,data);
	}
	
	/**
	 * 公寓工单
	 */

	//取消周期预约
	cancelServicePeriod(id):Promise<any>{
		return this.ajaxService.get(this.cancelServicePeriodUrl,{params:new HttpParams().set('workOrderId',id)});
	}
	//满意/不满意
	commont(data):Promise<any>{
		return this.ajaxService.post(this.satistyUrl,data);
	}



	getBannerList(data):Promise<any>{
		var temp = new URLSearchParams();
		temp.set('pageSize',data.pageSize)
		temp.set('pageNum',data.pageNum)
		temp.set('TOKEN',data.TOKEN)
		console.log(temp)
		return this.ajaxService.get(this.getBannerListUrl,{params:temp});
	}
	
	


}