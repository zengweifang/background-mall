import { Injectable } from '@angular/core';
import { AjaxService } from '../../../shared/services/ajax.service';
import { service, config } from '../../../core/core.config';
import { utils } from "../../../shared/utils/utils";
import { HttpParams } from "@angular/common/http";
import { ChannelCheckOrderService } from "../../channel-management/channel-check-order/channelCheckOrder.service";

@Injectable()
export class OperationListService {
	constructor(
		private ajaxService: AjaxService,
		private channelCheckOrderService: ChannelCheckOrderService,
	) { }

	setOrdersManagementSearchCriteria(params: any) {
		utils.setLocalStorage('OrdersManagementSearchCriteria', params);
	}

	getOrderManagementSearchCriteria() {
		return utils.getLocalStorage('OrdersManagementSearchCriteria');
	}

	cleanOrderManagementSearchCriteria() {
		utils.setLocalStorage('OrdersManagementSearchCriteria', null);
	}

	setOperationOrdersManagementSearchCriteria(params: any) {
		utils.setLocalStorage('OperationOrdersManagementSearchCriteria', params);
	}

	getOperationOrderManagementSearchCriteria() {
		return utils.getLocalStorage('OperationOrdersManagementSearchCriteria');
	}

	cleanOperationOrderManagementSearchCriteria() {
		utils.setLocalStorage('OperationOrdersManagementSearchCriteria', null);
	}

	private orderConfigListAPI = service.commonService + '/background-manage/channel/order-config/list';
	private updateOrderConfigAPI = service.commonService + '/background-manage/channel/order-config/update';
	private deleteCityAPI = service.commonService + '/background-manage/service-provider/removeProviderInOrderDistribution';
	private supplierListAPI = service.commonService + '/background-manage/service-provider/list';


	private getChannelListAPI = service.commonService + '/background-manage/channel/listPager';
	private getChannelInfoAPI = service.commonService + '/background-manage/channel/edit?id=';
	private changeChannelStatusAPI = service.commonService + '/background-manage/channel/changeStatus?id=:id&status=:status';
	private getGoodsListAPI = service.commonService + '/background-manage/channel/goods/channelGoodsPager';
	private deleteGoodsByIdsAPI = service.commonService + '/background-manage/channel/goods/removeChannelGoodsByIds';

	private getAllChannelListAPI = service.commonService + '/background-manage/channel/listAll';
	private copyChannelAPI = service.commonService + '/background-manage/channel/goods/copyChannel';
	private updateChannelGoodsPriceAPI = service.commonService + '/background-manage/channel/goods/updateChannelGoods';

	private getExcludeGoodsAPI = service.commonService + '/background-manage/channel/goods/listByExcludeChannelGoodsPage';
	private getDzListByExcludeGoodsPagerAPI = service.commonService + '/background-manage/channel/dianping-goods/listByExcludeGoodsPager';
	private addGoodsAPI = service.commonService + '/background-manage/channel/goods/batchSave';

	private getGoodsTypeAPI = service.commonService + '/background-manage/goods-type/names/';

	private getLatestOrderStatusAPI = service.commonService + '/background-manage/managerorder/getLatestOrderStatus?orderId=';

	private getSecondChannelListAPI = service.commonService + '/background-manage/channel/listPager';
	private syncParentChannelGoodsAPI = service.commonService + '/background-manage/channel/sync?parentId=';
	private addNewSecondChannelAPI = service.commonService + '/background-manage/channel/save';

	private getDianpingGoodsListAPI = service.commonService + '/background-manage/channel/dianping-goods/listPage';
	private updateGoodsStateAPI = service.commonService + '/background-manage/channel/dianping-goods/batchMarket';
	private addRemarkAPI = service.commonService + '/background-manage/managerorder/addCustomerServiceRemark';
	private dianpingAddGoodsAPI = service.commonService + '/background-manage/channel/dianping-goods/save';
	private dianpingUpdateGoodsAPI = service.commonService + '/background-manage/channel/dianping-goods/update';
	private dianpingCheckGoodsAPI = service.commonService + '/background-manage/channel/dianping-goods/editor?id=';
	private getDianpingPlatformGoodsRelAPI = service.commonService + '/background-manage/channel/dianping-goods/platformGoodsRel?id=';
	private getChannelCityAPI = service.commonService + '/background-manage/channel/dianping-goods/listChannelCityByPage';

	private getGroupOrderOperationLogAPI = service.commonService + '/background-manage/managerorder/groupOrderOperationLog?orderId=';

	private getDianpingOrderStatusAPI = service.commonService + '/background-manage/managerorder/dianping/status/';
	private getCountOfTakingAndReorderAPI = service.commonService + '/background-manage/managerorder/getCountOfTakingAndReorder?orderId=';

	/* 批量重新发起订单获取订单信息 */
	private getGroupOrderInfoAPI = service.commonService + '/background-manage/managerorder/groupSubmitOrderInfo?orderId=';
	/* 获取订单信息 */
	private getOrderInfoAPI = service.commonService + '/background-manage/managerorder/submitOrderInfo';
	/* 获取订单可用服务时间 */
	private getOrderAvailableServiceTimeListAPI =  service.commonService + '/background-manage/managerorder/getOrderAvailableServiceTimeList';
	private getOrderAvailableServiceTimeAPI =  service.commonService + '/background-manage/managerorder/getOrderAvailableServiceTime';
	/* 重新下单接口 */
	private resendOrderAPI = service.commonService + '/background-manage/managerorder/reorder';
	/* 批量取消自动派单／抢单 接口 */
	private cancelAutoGetOrdersAPI = service.commonService + '/background-manage/managerorder/groupCancelOrders';
	/* 获取有效真实商品 */
	private getRealGoodsListAPI = service.commonService + '/background-manage/goods/listOriginalGoods';

	private manageDistributionOrderAPI = service.commonService + '/background-manage/managerorder/manageDistributionOrder';

	private cancelReceiveOrderAPI = service.commonService + '/background-manage/managerorder/cancelReceiveOrder?';

	// 获取店铺区域
	private getStoreAreasAPI = service.commonService + '/background-manage/store/areas/';

	// 分页获取套餐关联商品
	private getPackGoodsAPI = service.commonService + '/background-manage/channel/dianping-goods/listPackageGoodsByPage';

	// 批量删除点评套餐商品接口
	private patchDeletePackageGoodsAPI = service.commonService + '/background-manage/channel/dianping-goods/removePackageGoodsByIds?idList=';

	// 保存点评套餐商品
	private batchSavePackageGoodsAPI = service.commonService + '/background-manage/channel/dianping-goods/batchSavePackageGoods';

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	};


	getChannelInfo(id: String): Promise<any> {
		return this.ajaxService.get(`${this.getChannelInfoAPI}${id}`)
	}

	changeChannelStatus(id:string, status:number): Promise<any> {
		return this.ajaxService.post(this.changeChannelStatusAPI.replace(':id', id).replace(':status', status.toString()));
	}

	getGoodsList(params): Promise<any> {
		return this.ajaxService.post(this.getGoodsListAPI, params);
	}

	getChannelList(params:any): Promise<any> {
		return this.ajaxService.post(this.getChannelListAPI, params);
	}

	saveChannelInfo(item:any) {
		utils.setLocalStorage('channelInfo', item);
	}

	deleteGoodsByIds(ids:any): Promise<any> {
		return this.ajaxService.post(this.deleteGoodsByIdsAPI, ids);
	}

	getGoodsType(goodTypeId:string): Promise<any> {
		return this.ajaxService.get(`${this.getGoodsTypeAPI}/${goodTypeId}`);
	}

    /* list */
    getOrderConfigList(params:any): Promise<any> {
        return this.ajaxService.post(this.orderConfigListAPI, params);
	}
	
	updateOrderConfig(params:any): Promise<any> {
		return this.ajaxService.post(this.updateOrderConfigAPI, params);
	}

	deleteCity(params:any): Promise<any> {
		return this.ajaxService.post(this.deleteCityAPI, params);
	}

	getAllChannelList(params:any): Promise<any> {
		return this.ajaxService.post(this.getAllChannelListAPI, {});
	}

	copyChannel(params:any): Promise<any> {
		return this.ajaxService.post(this.copyChannelAPI, params);
	}

	updateChannelGoodsPrice(params:any): Promise<any> {
		return this.ajaxService.post(this.updateChannelGoodsPriceAPI, params);
	}

	getExcludeGoods(params:any): Promise<any> {
		return this.ajaxService.post(this.getExcludeGoodsAPI, params);
	}

	// 获取点评未被套餐添加上商品列表
	getDzListByExcludeGoodsPager(params: any): Promise<any> {
		return this.ajaxService.post(this.getDzListByExcludeGoodsPagerAPI, params);
	}

	addGoods(params:any): Promise<any> {
		return this.ajaxService.post(this.addGoodsAPI, params);
	}

	metadata(params:any): Promise<any> {
		return this.channelCheckOrderService.metadata();
	}

	getChannelOrderList(params:any): Promise<any> {
		return this.channelCheckOrderService.getChannelServiceOrderList(params);
	}

	getLatestOrderStatus(mainKeyId:string): Promise<any> {
		return this.ajaxService.get(`${this.getLatestOrderStatusAPI}${mainKeyId}`)
	}

	getSecondChannelList(params:any): Promise<any> {
		return this.ajaxService.post(this.getSecondChannelListAPI, params);
	}

	// 同步父渠道商品
	syncParentChannelGoods(parentId:string): Promise<any> {
		return this.ajaxService.post(`${this.syncParentChannelGoodsAPI}${parentId}`);
	}

	// 新增二级渠道
	addNewSecondChannel(params:any): Promise<any> {
		return this.ajaxService.post(this.addNewSecondChannelAPI, params);
	}

	getDianpingGoodsList(params:any): Promise<any> {
		return this.ajaxService.post(this.getDianpingGoodsListAPI, params);
	}

	// 点评批量下架
	updateGoodsState(params:any): Promise<any> {
		const URL = `${this.updateGoodsStateAPI}?ids=${params.ids}&state=${params.state}`
		return this.ajaxService.post(URL);
	}

	// 点评添加商品
	dianpingAddGoods(params:any): Promise<any> {
		return this.ajaxService.post(this.dianpingAddGoodsAPI, params);
	}

	// 更新点评商品
	dianpingUpdateGoods(params:any): Promise<any> {
		return this.ajaxService.post(this.dianpingUpdateGoodsAPI, params);
	}

	dianpingCheckGoods(id: string): Promise<any> {
		return this.ajaxService.get(`${this.dianpingCheckGoodsAPI}${id}`);
	}

	// 添加备注
	addRemark(params:any): Promise<any> {
		return this.ajaxService.post(this.addRemarkAPI, params);
	}

	// 获取所有城市
	getChannelCity(params:any): Promise<any> {
		return this.ajaxService.post(this.getChannelCityAPI, params);
	}

	// 获取流转记录
	getGroupOrderOperationLog(id: string): Promise<any> {
		return this.ajaxService.get(`${this.getGroupOrderOperationLogAPI}${id}`);
	}

	// 获取点评订单状态
	getDianpingOrderStatus(id: string): Promise<any> {
		return this.ajaxService.get(`${this.getDianpingOrderStatusAPI}${id}`);
	}

	// 获取正在抢单的供应商的个数，和重新发起的次数
	getCountOfTakingAndReorder(id: string): Promise<any> {
		return this.ajaxService.get(`${this.getCountOfTakingAndReorderAPI}${id}`);
	}

	// 获取组订单信息
	getGroupOrderInfo(orderId: string): Promise<any> {
		return this.ajaxService.get(`${this.getGroupOrderInfoAPI}${orderId}`);
	}

	// 获取订单信息
	getOrderInfo(params: any): Promise<any> {
		return this.ajaxService.post(this.getOrderInfoAPI, params);
	}

	// 获取订单可用服务时间
	getOrderAvailableServiceTimeList(params: any): Promise<any> {
		return this.ajaxService.post(this.getOrderAvailableServiceTimeListAPI, params);
	}
	getOrderAvailableServiceTime(params: any): Promise<any> {
		return this.ajaxService.post(this.getOrderAvailableServiceTimeAPI, params);
	}

	// 重新发起订单
	resendOrders(params: any): Promise<any> {
		return this.ajaxService.post(this.resendOrderAPI, params);
	}

	// 批量取消自动派单／抢单 接口
	cancelAutoGetOrders(ids: string[]): Promise<any> {
		return this.ajaxService.post(this.cancelAutoGetOrdersAPI, ids);
	}

	// 获取有效真实商品
	getRealGoodsList(params: any): Promise<any> {
		return this.ajaxService.post(this.getRealGoodsListAPI, params);
	}

	// 根据data.opType  1:重新提交订单，2:重新生成订单，3:取消订单
	manageDistributionOrder(params: any): Promise<any> {
		return this.ajaxService.post(this.manageDistributionOrderAPI, params);
	}

	// 取消订单
	cancleOrder(params: any): Promise<any> {
		return this.manageDistributionOrder(params);
	}

	cancelReceiveOrder(params: any): Promise<any> {
		if (!params.desc || params.reasonId) {
			return this.ajaxService.get(`${this.cancelAutoGetOrdersAPI}orderId=${params.orderId}&opType=${params.opType}`);
		} else {
			return this.ajaxService.get(`${this.cancelAutoGetOrdersAPI}orderId=${params.orderId}&opType=${params.opType}&reasonId=${params.reasonId}&desc=${params.desc}`);
		}
	}

	// 获取点评商品信息
	getDianpingPlatformGoodsRel(goodsId: string): Promise<any> {
		return this.ajaxService.get(this.getDianpingPlatformGoodsRelAPI + goodsId);
	}

	// 分页获取套餐关联商品
	getPackGoods(params: any): Promise<any> {
		return this.ajaxService.post(this.getPackGoodsAPI, params);
	}

	// 获取店铺区域
	getStoreAreas(params: any): Promise<any> {
		return this.ajaxService.post(this.getStoreAreasAPI, params);
	}

	// 批量删除点评套餐商品
	patchDeletePackageGoods(ids: string[]): Promise<any> {
		return this.ajaxService.post(this.patchDeletePackageGoodsAPI + ids);
	}

	// 保存点评套餐商品
	batchSavePackageGoods(params: any): Promise<any> {
		return this.ajaxService.post(this.batchSavePackageGoodsAPI, params);
	}

}