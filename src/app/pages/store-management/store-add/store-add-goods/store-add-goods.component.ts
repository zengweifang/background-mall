import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomModalService } from '../../../../shared/services/custom-modal.service';
import { Observable } from 'rxjs/Observable';
import { StoreAddGoodsService } from './store-add-goods.service';
import { StoreListModalComponent } from '../../store-list/store-list-modal/store-list-modal.component';
import { StoreManagementService } from '../../store-management.service';
@Component({
  selector: 'app-store-add-goods',
  templateUrl: './store-add-goods.component.html',
  styleUrls: ['./store-add-goods.component.scss']
})
export class StoreAddGoodsComponent implements OnInit {
  _current:number = 2
  _storeManagerAddGoodsForm: FormGroup
  _providerId: string = utils.getSessionStorage('userId');
  _storeId: string = '';
  _from: string = '';
  _reqParam = {
    goodname: '',
    typename: '',
    providerid: this._providerId,
    storeid: '',
    page: utils.pageParams()
  }
  _dataSet = [];
  _cateTip = "     ";
  _inventory:any = null;
  _total:number = 0
  _loading: boolean = false;
  _saveLoading: boolean = false;
  _canDeactivate: boolean = false;

  _allChecked = false;
  _disabledButton = true;
  _checkedNumber = 0;
  _indeterminate = false;

  constructor(private fb: FormBuilder,private message: NzMessageService,public customModalService: CustomModalService,private router:Router,private notificationService: NzNotificationService,private storeAddGoodsService: StoreAddGoodsService,private activatedRoute:ActivatedRoute,private storeManagementService: StoreManagementService) {
    this._storeId = this.activatedRoute.snapshot.paramMap.get('id');
    this._from = this.activatedRoute.snapshot.queryParamMap.get('from');
    this._reqParam.storeid = this._storeId;
  }

  ngOnInit() {
    this._storeManagerAddGoodsForm = this.fb.group({
      goodname: [''],
      typename: ['']
    });

    this.storeGoodsList();
  }


  storeGoodsList(){
    this._loading = true;
    this.storeAddGoodsService.getGoodsList(this._reqParam).then( res => {
      this._loading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        if(res.data){
          this._dataSet = res.data.goods ? res.data.goods : [];
          this._total = res.data.page.totalCount;
          for(let item of this._dataSet){
            item.quantity = null;
          }
        }else{
          this._dataSet = [];
        }
        this._refreshStatus();
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this._loading = false;
      this.message.create('error', '网络加载失败');
    })
  }

  search(){
    this._reqParam.page.currentPage = 1;
    this.storeGoodsList();
  }

  clear(){
    this._reqParam.goodname = '';
    this._reqParam.typename = '';
    this.storeGoodsList();
  }

  
  getGoodsType(item:any) {
		this.storeAddGoodsService.searchType(item.typeid).then(res => {
			if (utils.getStatusCode(res.code) == config.successCode) {
				this._cateTip = res.data;
			} else {
				this.message.create('error', res.message ? res.message : '品类获取失败');
			}
		}).catch(error => {
			this.message.create('error', '品类获取失败');
		})
	}

	showTip(e, item:any) {
		if (e) {
			this.getGoodsType(item);
		} else {
			this._cateTip = "     ";
		}
  }
  
  goodsInventory(){
    if(this._inventory == null || this._inventory == undefined){
      this.notificationService.create('error','库存不能为空','');
      return;
    }
    for(let item of this._dataSet){
      if(item.checked){
        item.quantity = this._inventory;
      }
    }
  }

  addGoodsList(){
    if(this._dataSet.length > 0){
      let addinfo = [],
          goods = {},
          templates = {},
          goodsList = [];

      for(let element of this._dataSet){
        if(element.checked){
          if(element.quantity == null || element.quantity == undefined){
            this.notificationService.create('error','请填写正确库存数量！','');
            return;
          }else{
            goods = { goodId: element.id, quantity: element.quantity, storeId: this._storeId,goodsTypeId: element.typeid }
            templates = { goodid: element.id, quantity: element.quantity }
            goodsList.push(templates);
            addinfo.push(goods);
          }
        }
      }

      this.storeAddGoodsService.addBatchgood(addinfo).then(res => {
        if (utils.getStatusCode(res.code) == config.successCode) {
          this._canDeactivate = true;
          this.router.navigate(['/storeManagement/storeAdd/storeAddSPTemplates', this._storeId], {queryParams : {goodsDtoList: JSON.stringify(goodsList), from: this._from == 'check'? 'goods': 'add'}}) 
        } else if(res.code == 1110537 || res.code == 1110546) {
          let _self = this;
          this.customModalService._confirm({
            title:'提示',
            content: '添加的保洁商品未进行服务设置，设置后才能添加成功?',
            okText: '现在去设置',
            cancelText: '取消',
            onOk(){
              let isVirtual
              if(res.code == 1110537){
                isVirtual = 0
              }else{
                isVirtual = 1
              }

              _self.customModalService._content({
                title:'服务设置',
                content: StoreListModalComponent,
                width: 780,
                componentParams: {
                  data: {},
                  from: 'storeAddGoods',
                  isVirtual: isVirtual,
                  id: _self._storeId
                },
                onOk (){
                  _self.storeAddGoodsService.addBatchgood(addinfo).then(res => {
                    if (utils.getStatusCode(res.code) == config.successCode) {
                      _self.storeManagementService.storeServiceInventoryDisable = false;
                      _self._canDeactivate = true;
                      _self.router.navigate(['/storeManagement/storeAdd/storeAddSPTemplates', _self._storeId], {queryParams : {goodsDtoList: JSON.stringify(goodsList), from: _self._from == 'check'? 'goods': 'add'}}) 
                    } else{
                      _self.message.create('error', res.message);
                    }
                  }).catch(error => {
                    _self.message.create('error', '网络连接失败');
                  })
                }
              });
            },
            onCancel(){
            },
    
          });
         
        }else{
          this.message.create('error', res.message);
        }
      }).catch(error => {
        this.message.create('error', '网络连接失败');
      })
    }else if(this._from == 'check'){
      // $state.go('storeEditGoods', { id: $stateParams.id });
    }else{
      let _self = this;
      this.customModalService._confirm({
        title:'提示',
        content: '成功添加商品后店铺才会在app上显示是否马上添加商品？',
        okText: '现在添加',
        cancelText: '以后再说',
        onOk(){
          _self._canDeactivate = true;
          _self.router.navigate(['/storeManagement/storeAdd/storeAddSPTemplates', _self._storeId], {queryParams : {goodsDtoList: JSON.stringify([]), from: _self._from == 'check'? 'goods': 'add'}}) 
        },
        onCancel(){
          _self._canDeactivate = true;
          this.router.navigate(['/storeManagement/storeList/storeList']) //跳转列表页面
        },

      });
    }
  }


  // 处理未保存的更改  路由守卫
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    // observable  貌似不行  Promise<boolean> | boolean 可以
    for(let i = 0 , len = this._dataSet.length ; i < len ; i ++){
      if(this._dataSet[i].quantity != null || this._dataSet[i].quantity != undefined){
        break;
      }
      if(i == len - 1){
        return true;
      }
    }

    if (this._canDeactivate){
        return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    
    return new Promise(resolve => {
      this.customModalService._confirm({
        title:'温馨提示',
        content: '如果确认返回，刚编辑的信息不会被保存。',
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

  _refreshStatus() {
    const allChecked = this._dataSet.every(value => value.checked === true);
    const allUnChecked = this._dataSet.every(value => !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
    this._disabledButton = !this._dataSet.some(value => value.checked);
    this._checkedNumber = this._dataSet.filter(value => value.checked).length;
  };


  _checkAll(value) {
      if (value) {
          this._dataSet.forEach(data => data.checked = true);
      } else {
          this._dataSet.forEach(data => data.checked = false);
      }
      this._refreshStatus();
  };

  toBack() {
    if (this._from == 'check') {//查看已添加服务区域页面跳转
        // $state.go('checkServiceArea', { id: $stateParams.id });
    }else {//返回
      this.router.navigate(['/storeManagement/storeList/storeList']) //跳转列表页面
    }
  };

}
