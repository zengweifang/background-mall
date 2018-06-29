import { Component, OnInit } from '@angular/core';
import { AmapService } from '../../services/amap.service';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { config, service } from '../../../core/core.config';
import { utils } from '../../../shared/utils/utils';
@Component({
  selector: 'app-gis-service-area-search',
  templateUrl: './gis-service-area-search.component.html',
  styleUrls: ['./gis-service-area-search.component.scss']
})
export class GisServiceAreaSearchComponent implements OnInit {
  _districtArea = [];
  _areaInfo = {
    currentProvince: null,
    currentCity: null,
    currentDistrict: null,
    searchParams: null
  }
  _searchLevel: string = '';
  _searchFeature: string = '';
  _province
  _city
  _district

  _count:number = 0;
  _showSearchContainer:boolean = false;
  constructor(private amapService: AmapService,private notificationService: NzNotificationService,private message: NzMessageService) { }

  ngOnInit() {
   
    this.initFun();
  }

  initFun(){
    let start = async () => {
      return await this.amapService.IntroduceDistrictExplorer();
    }

    start().then(districtExplorer => {
      this.amapService.loadAreaNode(100000).then(res =>{
        this._province = this.amapService.province;
      })
    }).catch(err => {
      console.log(err);
      this._count ++;
      console.log(this._count);
      if(this._count < 4){
        setTimeout(() => {
          this.initFun();
        }, 1000);
      }else{
        this.notificationService.create('error','搜索行政区服务加载失败,请刷新页面重试。','');
      }
    })
  }

  searchArea(){
    this.amapService.search(this._searchLevel,this._searchFeature);
  }

  modelChange(e,level){
    this._searchLevel = level;
    this._searchFeature = e;
    this.amapService.loadAreaNode(e .properties.adcode).then(res => {
      switch (level) {
          case 'province':
              this._areaInfo.currentCity = null;
              this._areaInfo.currentDistrict = null;
             
              this._city = this.amapService.city;
              this._district = this.amapService.district;
              break;
          case 'city':
              this._areaInfo.currentDistrict = null;
              this._district = this.amapService.district;
              break;
          case 'district': 
              break;
      }
      // this._areaInfo.searchParams = null;
    }).catch(err => {
      switch (level) {
        case 'province':
            this._areaInfo.currentCity = null;
            this._areaInfo.currentDistrict = null;
            this._city = this.amapService.city;
            this._district = this.amapService.district;
            this.amapService.provinceName = e.properties.name;
            break;
        case 'city':
            this._areaInfo.currentDistrict = null;
            this._district = this.amapService.district;
            this.amapService.cityName = e.properties.name;
            break;
        case 'district':
            this.amapService.districtName = e.properties.name;
            break;
      }
      // this._areaInfo.searchParams = null;
    })
  }

  searchPOIsByKeyword(param){
    this.amapService.searchPOIsByKeyword(param).then( res => {
      if(utils.getStatusCode(res.code) == config.successCode){
        this._showSearchContainer = true;
        if(!res.data.poi){
          this._districtArea = [];
        }else{
            if(res.data.poi.length > 15){
              this._districtArea = res.data.poi.splice(0,15)
            }else{
              this._districtArea = res.data.poi
            }
        }
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this.message.create('error', '网络加载失败');
    })
  }

  autoSearch(e){ 
    if(!e){
      this._showSearchContainer = false;
      return;
    }
    this.searchPOIsByKeyword(e);
  };

  autoBlur(e){
    setTimeout(() => {
      this._showSearchContainer = false;
    }, 200);
  }


  // 选择某个搜索关键字区域
  selectOneDistrictArea(item,param){
    param.searchParams = item.name;
    param.currentProvince = null;
    param.currentCity = null;
    param.currentDistrict = null;
    this._city = null;
    this._district = null;
    let pos = item.location.split(',');
    let position = [Number(pos[0]),Number(pos[1])];
    this.amapService.map.setZoomAndCenter(18,position);
  }

}
