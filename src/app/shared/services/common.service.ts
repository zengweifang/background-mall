import { Injectable } from '@angular/core';
import { config,service } from '../../core/core.config';
import { AjaxService } from '../../shared/services/ajax.service';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class CommonService {
  private getAllRegionUrl = `${service.commonService}/background-manage/administrative-region/list`;
  private getGoodsTypeUrl = service.commonService + '/background-manage/goods-type/names';
  //获取省和市
  private getAllProvinceAndCityAPI = service.commonService + '/background-manage/administrative-region/findAllProvinceAndCity';
  private getCityAllChildrenAPI = service.commonService + '/background-manage/administrative-region/listCityAllChildren?cityId=';
  
  constructor(private ajaxService : AjaxService) { }
  //  调用全国行政区的接口,适用店铺地址的输入框
  getAllRegion(data):Promise<any>{
		return this.ajaxService.post(this.getAllRegionUrl,data);
  }

  getGoodsType(data):Promise<any>{
		return this.ajaxService.get(this.getGoodsTypeUrl+"/"+data);
  }

  getAllProvinceAndCity(data):Promise<any>{
		return this.ajaxService.get(this.getAllProvinceAndCityAPI);
  }

  getCityAllChildren(id:string): Promise<any> {
    return this.ajaxService.get(this.getCityAllChildrenAPI + id);
  }
  
}
