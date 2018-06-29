import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { CustomModalService } from '../../../../shared/services/custom-modal.service';
import { Observable } from 'rxjs/Observable';
import { StoreManagementService } from '../../store-management.service';
import { StoreAddSpTemplatesService } from './store-add-sp-templates.service';
import { Store } from "@ngrx/store";
import { LOADINGOPEN, LOADINGCLOSE } from "../../../../shared/reducer/page-load";
@Component({
  selector: 'app-store-add-sp-templates',
  templateUrl: './store-add-sp-templates.component.html',
  styleUrls: ['./store-add-sp-templates.component.scss']
})
export class StoreAddSpTemplatesComponent implements OnInit {
  _current:number = 3;
  _isDelivery: number = 0;
  _isDeliveryList = [{id:0,name:'否'},{id:1,name:'是'}];
  _quantity: number = 0;
  _freightTemplates = [];
  _storeId: string = '';
  _from: string = '';
  _baseInfo = {
    storeId: '',
    goodIdList: [],
    freightTemplateId: ''
  }
  _freightTemplateId
  _reqParam = {
    storeId: '',
    page: utils.pageParams()
  }
  _totalCount: number = 0;
  _pageIndex: number = 1;
  _pageSize: number = 10;

  _canDeactivate: boolean = false;

  constructor(private message: NzMessageService,public customModalService: CustomModalService,private router:Router,private notificationService: NzNotificationService,private activatedRoute:ActivatedRoute,private storeManagementService: StoreManagementService,private storeAddSpTemplatesService: StoreAddSpTemplatesService,private store: Store<AppState>) {
    this._storeId = this.activatedRoute.snapshot.paramMap.get('id');
    this._from = this.activatedRoute.snapshot.queryParamMap.get('from');
    this._freightTemplateId = this.activatedRoute.snapshot.queryParamMap.get('freightTemplateId');
    if(this._freightTemplateId == null || this._freightTemplateId == undefined){
      this._isDelivery = 0;
    }else{
      this._isDelivery = 1;
    }

    let goodsDtoList = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('goodsDtoList'));
    
    for(let item of goodsDtoList){
      this._baseInfo.goodIdList.push(item.goodid);
      this._quantity += item.quantity;
    }
    this._baseInfo.storeId = this._storeId;
    this._reqParam.storeId = this._storeId;
  }

  ngOnInit() {

    
  }
  getTemplatesInfo(){
    this.store.dispatch({type: LOADINGOPEN});
    this.storeAddSpTemplatesService.spTemplatesList(this._reqParam).then(res => {
      this.store.dispatch({type: LOADINGCLOSE});
			if (utils.getStatusCode(res.code) == config.successCode) {
				if(res.data){
          this._freightTemplates = res.data.freightTemplateVoList ? res.data.freightTemplateVoList: [];
          this._totalCount = res.data.page.totalCount ? res.data.page.totalCount : 0
        }

        if(this._freightTemplateId){
          this._baseInfo.freightTemplateId = this._freightTemplateId;
        }else{
          for(let item of this._freightTemplates){
            item.isDefault && (this._baseInfo.freightTemplateId = item.id);
          }
        }
			} else {
				this.message.create('error', res.message);
			}
		}).catch(error => {
      this.store.dispatch({type: LOADINGCLOSE});
			this.message.create('error', '网络连接失败');
		})
  }

  //保存运费模版设置，并确认是否开启店铺
  setGoodsFreightTemplateRel(){
    if(this._isDelivery == 0){
        if(this._from =='add'){
            this.toOpenStore();
        }else{
          this._baseInfo.freightTemplateId = "";
          this.store.dispatch({type: LOADINGOPEN});
          this.storeAddSpTemplatesService.setGoodsFreightTemplateRel(this._baseInfo).then(res => {
            this.store.dispatch({type: LOADINGCLOSE});
            if (utils.getStatusCode(res.code) == config.successCode) {
              this.toOpenStore();
            } else {
              this.message.create('error', res.message);
            }
          }).catch(error => {
            this.store.dispatch({type: LOADINGCLOSE});
            this.message.create('error', '网络连接失败');
          })
        }
        
    }else{
      this.store.dispatch({type: LOADINGOPEN});
      this.storeAddSpTemplatesService.setGoodsFreightTemplateRel(this._baseInfo).then(res => {
        this.store.dispatch({type: LOADINGCLOSE});
        if (utils.getStatusCode(res.code) == config.successCode) {
          this.toOpenStore();
        } else {
          this.message.create('error', res.message);
        }
      }).catch(error => {
        this.store.dispatch({type: LOADINGCLOSE});
        this.message.create('error', '网络连接失败');
      })
    }
    
  };

  toOpenStore(){
    if(this._from == 'goods' || this._from == 'check'){
      // $state.go('storeEditGoods',{id:$stateParams.id});
    }else{
      let _self = this;
      this.customModalService._confirm({
        title:'保存成功！',
        content: '是否马上开启店铺？',
        okText: '确认',
        cancelText: '取消',
        onOk(){
          let info = {
            id: _self._storeId,
            status:true
          }
          _self.store.dispatch({type: LOADINGOPEN});
          _self.storeAddSpTemplatesService.update(info).then(res => {
            _self.store.dispatch({type: LOADINGCLOSE});
            if (utils.getStatusCode(res.code) == config.successCode) {
              _self.notificationService.create('success',res.message,'');
              _self._canDeactivate = true;
              _self.router.navigate(['/storeManagement/storeList/storeList']) //跳转列表页面
            } else {
              _self.message.create('error', res.message);
            }
          }).catch(error => {
            _self.store.dispatch({type: LOADINGCLOSE});
            _self.message.create('error', '网络连接失败');
          })
        },
        onCancel(){
          //不立即开启店铺，跳转到店铺列表页面，状态是关闭中，需要去到管理页面手动开启
          this._canDeactivate = true;
          _self.router.navigate(['/storeManagement/storeList/storeList']) //跳转列表页面
        },

      });
    }
  }

  modelChange(e){
    if(e == 1){
      this.getTemplatesInfo();
    }
  }

  pageIndexChange(e){
    if(e == this._pageIndex){
      return;
    }else{
      this._pageIndex = e;
      this._reqParam.page.currentPage = this._pageIndex;
      this.getTemplatesInfo();
    }
    
  }

  pageSizeChange(e){
    this._reqParam.page.pageSize = e;
    this.getTemplatesInfo();
  }


  // 处理未保存的更改  路由守卫
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    // observable  貌似不行  Promise<boolean> | boolean 可以

    if (this._canDeactivate){
        return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    
    return new Promise(resolve => {
      this.customModalService._confirm({
        title:'温馨提示',
        content: '关闭此页面商品将免邮处理，是否确定？',
        okText: '确认',
        cancelText: '取消',
        onOk(){
          resolve(true)
        },
        onCancel(){
          resolve(false)
        },

      });
    })
  }

  toAddTemplates(){
    this._canDeactivate = true;
    this.router.navigate(['/storeManagement/SPTemplates/SPTemplatesAdd',this._storeId], {queryParams : {goodsDtoList: this.activatedRoute.snapshot.queryParamMap.get('goodsDtoList'), from: this._from}}) //跳转到创建运费模版页
  }

  toBack =  function(ev){
    if(this._from == 'goods' || this._from == 'check'){
      this._canDeactivate = true;
      // $state.go('storeEditGoods',{id:$stateParams.id});
    }else{
      this.router.navigate(['/storeManagement/storeList/storeList']) //跳转列表页面
    }	
  };
}
