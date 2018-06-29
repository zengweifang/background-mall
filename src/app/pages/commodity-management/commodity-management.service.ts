import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { service, config } from '../../core/core.config';
import { utils } from "../../shared/utils/utils";
import { HttpParams } from "@angular/common/http";
import { ChannelCheckOrderService } from "../channel-management/channel-check-order/channelCheckOrder.service";

@Injectable()
export class CommodityManagementService {
	constructor(
		private ajaxService: AjaxService,
		private channelCheckOrderService: ChannelCheckOrderService,
	) { }

	setCommodityManagementSearchParams(params: any) {
		utils.setLocalStorage('CommodityManagementSearchParams', params);
	}

	getCommodityManagementSearchParams() {
		return utils.getLocalStorage('CommodityManagementSearchParams');
	}

	//审核成功的商品/审核中的商品/审核失败的商品列表查询
	private getAuditListAPI = service.commonService + '/background-manage/goodsVerifyManage/audit/list';
	//已失效的商品列表查询
	private getInvalidListAPI = service.commonService + '/background-manage/goodsVerifyManage/invalid/list';
	// 删除审核商品接口
	private deleteGoodsAPI = service.commonService + '/background-manage/goods/delete';
	
	private getEditGoodInfoAPI = service.commonService + '/background-manage/goods/preVerifyView';

	private updateGoodInfoAPI = service.commonService + '/background-manage/goods/update';

	private getGoodsAttributesAPI = service.commonService + '/background-manage/goods/listByName';

	private getGoodsAttributeDetailAPI = service.commonService + '/background-manage/attribute/buildByAttributeGroupId';

	private getGoodsTypeAPI = service.commonService + '/background-manage/goodsVerifyManage/goodsType/list';

	private getGoodsInfoAPI = service.commonService + '/background-manage/goodsVerifyManage/goodsManage/list';

	private getShopListAPI = service.commonService + '/background-manage/goodsVerifyManage/shelvesMgr/list';

	private storesQuantityUpdateAPI = service.commonService + '/background-manage/goodsVerifyManage/storesQuantity/update';

	private storesGoodsUpAndDownAPI = service.commonService + '/background-manage/goodsVerifyManage/storesGoods/upAndDown';

	getAuditList(params: any, {isInvalid = false} = {}): Promise<any> {
		let url = this.getAuditListAPI;
		if (isInvalid) {
			url = this.getInvalidListAPI;
		}
		return this.ajaxService.post(url, params);
	}

	// 删除审核商品
	deleteGoods(ids: string[]): Promise<any> {
		const params = new HttpParams().set('goodIdList', ids.toString());
		return this.ajaxService.post(this.deleteGoodsAPI, null, {
			params
		});
	}

	getEditGoodInfo(id: string): Promise<any> {
		const params = new HttpParams().set('goodsId', id);
		return this.ajaxService.get(this.getEditGoodInfoAPI, {
			params
		})
	}

	updateGood(params: any): Promise<any> {
		return this.ajaxService.post(this.updateGoodInfoAPI, params);
	}

	getGoodsAttributes(keyword: string): Promise<any> {
		const params = new HttpParams().set('name', keyword);
		return this.ajaxService.get(this.getGoodsAttributesAPI, {
			params
		});
	}

	getGoodsAttributeDetail(attributeGroupId: string): Promise<any> {
		const params = new HttpParams().set('attributeGroupId', attributeGroupId);
		return this.ajaxService.get(this.getGoodsAttributeDetailAPI, {
			params
		})
	}

	/**
	 * 获取商品类型
	 * 
	 * @param {*} params {parentId:string,providerId:string} 父id，当前供应商id
	 * @returns {Promise<any>} 
	 * @memberof CommodityManagementService
	 */
	getGoodsType(params: any): Promise<any> {
		return this.ajaxService.post(this.getGoodsTypeAPI, params);
	}


	getGoodsInfo(goodsId: string): Promise<any> {
		const params = new HttpParams().set('id', goodsId);
		return this.ajaxService.post(this.getGoodsInfoAPI, null, {
			params
		});
	}

	getShopList(params: any): Promise<any> {
		return this.ajaxService.post(this.getShopListAPI, params);
	}

	storesQuantityUpdate(params: any): Promise<any> {
		return this.ajaxService.post(this.storesQuantityUpdateAPI, params);
	}

	storesGoodsUpAndDown(params: any): Promise<any> {
		return this.ajaxService.post(this.storesGoodsUpAndDownAPI, params);
	}

}