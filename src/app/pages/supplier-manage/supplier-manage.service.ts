import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import 'rxjs/add/operator/toPromise';
import { config,service } from '../../core/core.config';
import { HttpParams } from "@angular/common/http";
@Injectable()
export class SupplierManageService {
	constructor(private ajaxService : AjaxService){}
  // --- 供应商列表start ---
  // 供应商列表
	supplierFindAll():Promise<any>{
    let supplierFindAllUrl = `${service.commonService}/background-manage/service-type/findAll`;
		return this.ajaxService.get(supplierFindAllUrl);
  }
  
  supplierGetList(data):Promise<any>{
    let supplierGetListUrl = `${service.commonService}/background-manage/service-provider/list`;
		return this.ajaxService.post(supplierGetListUrl,data);
  }

  // 新增供应商
  create(data):Promise<any>{
    let createUrl = `${service.commonService}/background-manage/service-provider/create`;
		return this.ajaxService.post(createUrl,data);
  }
  //根据供应商id获取品类树
  getGoodsTypeById(id):Promise<any>{
    let getGoodsTypeByIdUrl = `${service.commonService}/background-manage/service-provider/goods-type/list/${id}`;
		return this.ajaxService.get(getGoodsTypeByIdUrl);
  }

  //获取供应商信息
  getProviderById(id):Promise<any>{
    let getProviderByIdByIdUrl = `${service.commonService}/background-manage/service-provider/info/${id}`;
		return this.ajaxService.get(getProviderByIdByIdUrl);
  }

  //保存供应商品类
  saveGoodsType(data):Promise<any>{
    let saveGoodsTypeUrl = `${service.commonService}/background-manage/service-provider/goods-type/save`;
		return this.ajaxService.post(saveGoodsTypeUrl,data);
  }

  // 编辑供应商
  update(data):Promise<any>{
    let updateUrl = `${service.commonService}/background-manage/service-provider/update`;
		return this.ajaxService.post(updateUrl,data);
  }

  // 查看基本信息  //封停/解封接口
  toHandByStatus(id,status):Promise<any>{
    let toHandByStatusUrl = `${service.commonService}/background-manage/service-provider/lockedOut?id=${id}&status=${status}`;
		return this.ajaxService.post(toHandByStatusUrl);
  }

  getGoodsTypeInfo(data):Promise<any>{
    let getGoodsTypeInfoUrl = `${service.commonService}/background-manage/service-provider/goods-type/list`;
		return this.ajaxService.post(getGoodsTypeInfoUrl,data);
  }

  getAllGoodsType(providerId,parentId):Promise<any>{
    let getAllGoodsTypeUrl = `${service.commonService}/background-manage/service-provider/goods-type/tree?providerId=${providerId}&parentId=${parentId}`;
		return this.ajaxService.get(getAllGoodsTypeUrl);
  }

  delete(data):Promise<any>{
    let url = `${service.commonService}/background-manage/service-provider/goods-type/delete`;
    const hParams = new HttpParams().set('providerId', data.providerId).set('goodsTypeIds', data.goodsTypeIds)
		return this.ajaxService.post(url,{},{params: hParams});
  }

  // --- 供应商列表end ---

  // --- 商务审核start ---

  // 获取待审核列表
  getStoreAreaVerifyPage(data):Promise<any>{
    let getStoreAreaVerifyPageUrl = `${service.commonService}/background-manage/store/getStoreAreaVerifyPage`;
		return this.ajaxService.post(getStoreAreaVerifyPageUrl,data);
  }
  // 获取待审核详情
  getStoreAreaVerifyDetail(data):Promise<any>{
    let getStoreAreaVerifyDetailUrl = `${service.commonService}/background-manage/store/getStoreAreaVerifyDetail`;
		return this.ajaxService.post(getStoreAreaVerifyDetailUrl,data);
  }
  // 通过审核
  auditPass(data):Promise<any>{
    let auditPassUrl = `${service.commonService}/background-manage/store/passAreaVerify`;
		return this.ajaxService.post(auditPassUrl,data);
  }

  // 未通过审核
  notPass(data):Promise<any>{
    let notPassUrl = `${service.commonService}/background-manage/store/refuseAreaVerify`;
		return this.ajaxService.post(notPassUrl,data);
  }

  // --- 商务审核end ---
}
