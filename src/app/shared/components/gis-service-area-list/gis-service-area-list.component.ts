import { Component, OnInit, Input,DoCheck } from '@angular/core';
import { NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import { SupplierManageService } from '../../../pages/supplier-manage/supplier-manage.service';
import { StoreAddAreaService } from '../../../pages/store-management/store-add/store-add-area/store-add-area.service';
import { utils } from '../../utils/utils';
import { config, service } from '../../../core/core.config';
import { AmapService } from '../../services/amap.service';
import { FailReasonComponent } from '../fail-reason/fail-reason.component';
import { CustomModalService } from '../../services/custom-modal.service';
import { Store } from "@ngrx/store";
import { LOADINGOPEN, LOADINGCLOSE } from "../../reducer/page-load";
@Component({
  selector: 'app-gis-service-area-list',
  templateUrl: './gis-service-area-list.component.html',
  styleUrls: ['./gis-service-area-list.component.scss']
})
export class GisServiceAreaListComponent implements OnInit,DoCheck {
  @Input() canEdit:boolean
  @Input() showCheckbox:boolean
  @Input() showStatus:boolean
  @Input() showRadio:boolean
  @Input() showAuditBtn:boolean
  @Input() showDeleteBtn:boolean
  @Input() showPageIndex:boolean
  @Input() showSearch:boolean

  _saveDrawArea = []
  _addSaveDrawArea = []
  _totalCount: number = 0;
  _pageIndex: number = 1;
  _pageSize: number = 10;
  _selectedItem = {
    id: ''
  }
  _name: string = '';
  _loading:boolean = false;
  constructor(private message: NzMessageService,private customModalService:CustomModalService,private amapService: AmapService,private notificationService: NzNotificationService,private supplierManageService: SupplierManageService,private storeAddAreaService: StoreAddAreaService,private store: Store<AppState>) { }

  ngOnInit() {
    setTimeout(() => {
      this._saveDrawArea = this.amapService.polygons;
      this._addSaveDrawArea = this.amapService.addPolygons;
      this.refreshAreaData();
    },0)
  }

  ngDoCheck(){

  }

  refreshAreaData() {
    this.amapService.pageThis.refreshData(this.amapService.pageThis._reqParam).then(res => {
      this._saveDrawArea = res.polygons;
      this._totalCount = res.totalCount;
      this._selectedItem = {
        id: ''
      };
      this.amapService.selectRadio = this._selectedItem;
    });
  }

  modelChange(e){
    this.amapService.pageThis._reqParam.name = e;
  }
  searchAreaWithKeyword(){
    this.refreshAreaData();
  }

  showChanged(item){
    if(item.showInput){
      if(!item.id){
        this.notificationService.create('success','修改区域名成功','');
        item.showInput = !item.showInput;
        return;
      }
      if(!item.name){
        this.notificationService.create('error','区域名不能为空','');
        return;
      }
      var reqParam = {
          areaId: item.id,
          name: item.name
      }
      this.store.dispatch({type: LOADINGOPEN});
      this.storeAddAreaService.updateStoreAreaName(reqParam).then(res => {
        this.store.dispatch({type: LOADINGCLOSE});
        if(utils.getStatusCode(res.code) == config.successCode){
          this.notificationService.create('success','修改区域名成功','');
          item.showInput = !item.showInput;
        }else{
          this.message.create('error', res.message);
        }
      }).catch(err => {
        console.log(err)
        this.store.dispatch({type: LOADINGCLOSE});
        this.message.create('error', '网络加载失败');
      })
    }else{
        item.showInput = !item.showInput;
    }
  }
  // 选择某个区域时聚焦到区域的中心点
  selectOneItem(item){
    for(let item of this._saveDrawArea){
      item.showSelectColor = false;
    }

    for(let item of this._addSaveDrawArea){
      item.showSelectColor = false;
    }
    item.showSelectColor = true;
    if(item.id){
        this._selectedItem.id = item.id;
    }
    this.amapService.map.setZoomAndCenter(this.amapService.getAbs(item.content),this.amapService.getPolygonObjCenter(item.content));
    utils.setSessionStorage('polygonUuidSessionStorage','');
  }

  deleteArea(item,index,ev){
    if(item.id){
      let count = index;
      for(let i = 0 ; i <= index ; i ++){
          if(this._saveDrawArea[i].moreThanNumber || this._saveDrawArea[i].deleteStatus){
              count--;
          }
      }
      this.amapService.clearArea(item,count);
      item.status = 2;
      item.deleteStatus = true;
    }else{
        let count = index;
        for(let i = 0 ; i <= index ; i ++){
            if(this._addSaveDrawArea[i].moreThanNumber || this._addSaveDrawArea[i].deleteStatus){
                count--;
            }
        }
        this.amapService.clearArea(item,count);
        this._addSaveDrawArea.splice(index,1);
    }
    ev.stopPropagation();           
  }

  pageIndexChange(e){
    if(e == this._pageIndex){
      return;
    }else{
      this._pageIndex = e;
      this.amapService.pageThis._reqParam.page.currentPage = this._pageIndex;
      this.refreshAreaData();
    }
    
  }

  pageSizeChange(e){
    this.amapService.pageThis._reqParam.page.pageSize = e;
    this.refreshAreaData();
  }

  addArea(){
    this.amapService.defaultPolygonObj(this.amapService.map);
  }

  pass(){
    if(!this.amapService.selectRadio.id){
      this.notificationService.create('error','请选择要操作的区域','');
      return;
    }
    let _self = this;
    this.customModalService._confirm({
      content: '确定要对这个区域执行通过操作吗？',
      onOk() {
        _self._loading = true;
        let reqParam = {
            verifyIdList: [_self.amapService.selectRadio.id],
            verifyUserId: window.sessionStorage.getItem("userId"),
        }
        _self.supplierManageService.auditPass(reqParam).then(res => {
          _self._loading = false;
          if(utils.getStatusCode(res.code) == config.successCode){
            _self.notificationService.create('success',res.message,'');
            _self.amapService.selectRadio.id = "";
            utils.setSessionStorage('supplierAuditBusinessBasicInitTab','pass')
            _self.amapService.pageThis.refreshData();
          }else{
            _self.message.create('error', res.message);
          }
        }).catch(err => {
          _self._loading = false;
          _self.message.create('error', '网络加载失败');
        })
      },
      onCancel() {
      }
    });
  }

  notPass(){
    if(!this.amapService.selectRadio.id){
      this.notificationService.create('error','请选择要操作的区域','');
      return;
    }
    this.customModalService._content({
			title:'原因填写',
      content:FailReasonComponent,
      width: 300,
		});
  }

}
