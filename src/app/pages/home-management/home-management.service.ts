import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { service, config } from '../../core/core.config';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class HomeManagementService {
	constructor(private ajaxService: AjaxService) { }

	// 首页类目
	private homeCategoriesListAPI = service.commonService + '/background-manage/homepagecategory/query';
	private deleteHomeCategoriesAPI = service.commonService + '/background-manage/homepagecategory/delete/';
	private getHomeCategorieAPI = service.commonService + '/background-manage/homepagecategory/selectById/';
	private getRegionListAPI = service.commonService + '/background-manage/homepagecategory/regionEdit';
	private contentGroupListAPI = service.commonService + '/background-manage/content-group/listByPage';
	private insertCategoryAPI = service.commonService + '/background-manage/homepagecategory/insert/';
	private updteCategoryAPI = service.commonService + '/background-manage/homepagecategory/update/';
	private getChannelListAPI = service.commonService + '/background-manage/homepagecategory/listChannelByPage';
	private getExcludeChannelListAPI = service.commonService + '/background-manage/homepagecategory/listExcludeChannelByPage';
	private saveChannelRelAPI = service.commonService + '/background-manage/homepagecategory/saveChannelRel';
	private batchRemoveChannelRelAPI = service.commonService + '/background-manage/homepagecategory/batchRemoveChannelRel';
	private stopHomeCategoriesAPI = service.commonService + '/background-manage/homepagecategory/stop/';
	private openHomeCategoriesAPI = service.commonService + '/background-manage/homepagecategory/open/';

	// 首页公告
	private getNoticeListAPI = service.commonService + '/background-manage/notice/list';
	private deleteNoticeAPI = service.commonService + '/background-manage/notice/delete/';
	private addNoticeAPI = service.commonService + '/background-manage/notice/released';
	private saveDraftNoticeAPI = service.commonService + '/background-manage/notice/draft';
	private getReionEditAPI = service.commonService + '/background-manage/notice/regionEdit/';
	private updateNoticeAPI = service.commonService + '/background-manage/notice/update';
	private invalidNoticeAPI = service.commonService + '/background-manage/notice/invalid/';
	private getRegionAPI = service.commonService + '/background-manage/notice/listRegionPage/';
	private getNoticeInfoAPI = service.commonService + '/background-manage/notice/show/';

	// 首页专题
	private getSpecialListAPI = service.commonService + '/background-manage/homeoperation/list';
	private deleteSepecialAPI = service.commonService + '/background-manage/homeoperation/delete/';
	private addNewSepecialAPI = service.commonService + '/background-manage/homeoperation/create';
	private getSpecialInfoAPI = service.commonService + '/background-manage/homeoperation/detail/';
	private getSpecialRegionsAPI = service.commonService + '/background-manage/homeoperation/regionEdit/';
	private updateSpecialAPI = service.commonService + '/background-manage/homeoperation/update';

	// 首页广告
	private getAdListAPI = service.commonService + '/background-manage/homeAdvertisement/query';


	// 首页类目
	getCategoriesList(params: any): Promise<any> {
		return this.ajaxService.post(this.homeCategoriesListAPI, params);
	}

	deleteHomeCategories(id: string): Promise<any> {
		return this.ajaxService.get(this.deleteHomeCategoriesAPI + id);
	}

	getHomeCategory(id: string): Promise<any> {
		return this.ajaxService.get(this.getHomeCategorieAPI + id);
	}

	getRegionList(id: string): Promise<any> {
		const hParams = new HttpParams().set('homePageCategoryId', id)
		return this.ajaxService.get(this.getRegionListAPI, {
			params: hParams
		})
	}

	getContentGroupList(params: any): Promise<any> {
		return this.ajaxService.post(this.contentGroupListAPI, params);
	}

	insertCategory(params: any): Promise<any> {
		return this.ajaxService.post(this.insertCategoryAPI, params);
	}

	updteCategory(params: any): Promise<any> {
		return this.ajaxService.post(this.updteCategoryAPI, params);
	}

	getChannelList(params: any): Promise<any> {
		return this.ajaxService.post(this.getChannelListAPI, params);
	}

	getExcludeChannelList(params: any): Promise<any> {
		return this.ajaxService.post(this.getExcludeChannelListAPI, params);
	}

	saveChannelRel(params: any): Promise<any> {
		return this.ajaxService.post(this.saveChannelRelAPI, params);
	}

	batchRemoveChannelRel(params: any): Promise<any> {
		const hParams = new HttpParams().set('ids', params)
		return this.ajaxService.post(this.batchRemoveChannelRelAPI, null, {
			params: hParams
		})
	}

	stopHomeCategories(id: string): Promise<any> {
		return this.ajaxService.get(this.stopHomeCategoriesAPI + id);
	}

	openHomeCategories(id: string): Promise<any> {
		return this.ajaxService.get(this.openHomeCategoriesAPI + id);
	}

	// 首页公告
	getNoticeList(params: any): Promise<any> {
		return this.ajaxService.post(this.getNoticeListAPI, params);
	}

	deleteNotice(id: string): Promise<any> {
		return this.ajaxService.post(this.deleteNoticeAPI + id);
	}

	addNotice(params: any): Promise<any> {
		return this.ajaxService.post(this.addNoticeAPI, params);
	}

	saveDraftNotice(params: any): Promise<any> {
		return this.ajaxService.post(this.saveDraftNoticeAPI, params);
	}

	updateNotice(params: any): Promise<any> {
		return this.ajaxService.post(this.updateNoticeAPI, params);
	}

	getReionEdit(id: string): Promise<any> {
		return this.ajaxService.get(this.getReionEditAPI + id);
	}

	invalidNotice(id: string): Promise<any> {
		return this.ajaxService.post(this.invalidNoticeAPI + id);
	}
	
	getRegion(params: any): Promise<any> {
		return this.ajaxService.post(this.getRegionAPI, params);
	}

	getNoticeInfo(id: string): Promise<any> {
		return this.ajaxService.post(this.getNoticeInfoAPI+id);
	}

	// 首页专题
	getSpecialList(params: any): Promise<any> {
		return this.ajaxService.post(this.getSpecialListAPI, params);
	}

	deleteSepecial(params: any): Promise<any> {
		return this.ajaxService.post(this.deleteSepecialAPI, params);
	}

	addNewSepecial(params: any): Promise<any> {
		return this.ajaxService.post(this.addNewSepecialAPI, params);
	}

	getSpecialInfo(id: string): Promise<any> {
		return this.ajaxService.get(this.getSpecialInfoAPI + id);
	}
	
	getSpecialRegions(id: string): Promise<any> {
		return this.ajaxService.get(this.getSpecialRegionsAPI + id)
	}

	updateSpecial(params: any): Promise<any> {
		return this.ajaxService.post(this.updateSpecialAPI, params);
	}

	// 首页广告
	getAdList(params: any): Promise<any> {
		return this.ajaxService.post(this.getAdListAPI, params);
	}
}