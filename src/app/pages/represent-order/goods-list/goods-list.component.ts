import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { utils } from '../../../shared/utils/utils';
import { config, service } from '../../../core/core.config';
import { FormBuilder, FormGroup, FormControl,Validators } from "@angular/forms";
import { GoodsListService } from './goods-list.service';
import { Store } from "@ngrx/store";
import { LOADINGOPEN, LOADINGCLOSE } from "../../../shared/reducer/page-load";
import { CustomModalService } from '../../../shared/services/custom-modal.service';
import { RelationGoodsModalComponent } from './relation-goods-modal/relation-goods-modal.component';
import { ShoppingCartModalComponent } from './shopping-cart-modal/shopping-cart-modal.component'; 
@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit {
  _relationPackage = [] // 用户关联套餐
  _roObj = utils.getSessionStorage('roObj');
  _loading: boolean = false;
  _switchValue: boolean = true;
  _goodsListForm: FormGroup
  _processInstanceId = utils.getSessionStorage('processInstanceId');
  _reqParam = {
    goodsName: '',
    goodsTypeName: '',
    storeName: '',
    townCode: '',
    channelId: '',
    location: '',
    page: utils.pageParams()
  }
  _storageObj = [];
  _cartNumTotal = 0;

  _goodsListLoading: boolean = false;
  _goodsList = [];
  _total:number = 0

  constructor(private fb: FormBuilder,private message: NzMessageService,private router:Router,private goodsListService: GoodsListService,private store: Store<AppState>,private customModalService: CustomModalService,private notificationService: NzNotificationService) {

  }

  ngOnInit() {
    this._goodsListForm = this.fb.group({
      goodsName: [''],
      goodsTypeName: [''],
      storeName: ['']
    });
    if(!this._roObj){
      this.router.navigate(['/representingOrder/orderMsg'], {queryParams: {from: 'goodsList'}});
      return;
    }else{
      this._reqParam.townCode = this._roObj.administrateRegionId;
      this._reqParam.channelId = this._roObj.channelId;
      this._reqParam.location = this._roObj.location;
    }

    this.getServiceSubscriptionAvailableList(this._roObj.userId);
    this.getroGoodsList();
    this.exitOrderSubmitService();
    utils.removceSessionStorage('storageObj')
  }

  
  // 套餐 start
  getServiceSubscriptionAvailableList(id){
    this._loading = true;
    this.goodsListService.getServiceSubscriptionAvailableList(id).then(res => {
      this._loading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        this._relationPackage = res.data ? res.data : [];
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this._loading = false;
      this.message.create('error', '网络加载失败');
    })
  }

  showRelationGoods(item){
    this.customModalService._content({
      title:'选择预约商品',
      content: RelationGoodsModalComponent,
      width: 1000,
      componentParams: {
        item: item,
        roObj: this._roObj,
        switchValue: this._switchValue
      }
    });
  }

  // 套餐end


  getroGoodsList(){
    this._goodsListLoading = true;
    this.goodsListService.getroGoodsListService(this._reqParam).then(res => {
      this._goodsListLoading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        this._goodsList = res.data ? res.data : [];
        for(let item of this._goodsList){
          item.showInput = false;
          item.value = 1;
          item.min = 1;
          item.max = 10;
          item.disabled = false;
          item.text = '立即购买';
        }
        this._total = res.page.totalCount;
        if(this._goodsList.length == 0){
          if(!this._reqParam.goodsName && !this._reqParam.goodsTypeName && !this._reqParam.storeName){
            this.notificationService.create('error','该地区无可选商品，请更换地区再试','');
          }else{
            this.notificationService.create('error','该商品不覆盖此服务地址，请尝试其它供应商的类似商品','');
          }
        }
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this._goodsListLoading = false;
      this.message.create('error', '网络加载失败');
    })
  }

  // 释放库存
  exitOrderSubmitService(){
    //判断是否由确认订单页面返回

    if(this._processInstanceId){
      let data = {
          'processInstanceId': this._processInstanceId,
          'userId': this._roObj.userId
      };
      this.goodsListService.exitOrderSubmitService(data).then(res => {
        if(utils.getStatusCode(res.code) == config.successCode){
          this.message.create('success', '去库存成功');
        }else{
          this.message.create('error', res.message);
        }
      }).catch(err => {
        this.message.create('error', '网络加载失败');
      })
    }
  }


  search(){
    this._reqParam.page.currentPage = 1;
    this.getroGoodsList();
  }

  clear(){
    this._reqParam.goodsName = '';
    this._reqParam.goodsTypeName = '';
    this._reqParam.storeName = '';
    this._reqParam.page.currentPage = 1;
    this.getroGoodsList();
  }

  switchTurn(param){
    switch (param){
      case true:
        this._switchValue = true;
        this._reqParam.page.currentPage = 1;
        this._reqParam.townCode = this._roObj.administrateRegionId;
        this._reqParam.location = this._roObj.location;
        this.getroGoodsList();
        break;
      case false:
        this._switchValue = false;
        this._reqParam.page.currentPage = 1;
        this._reqParam.townCode = '';
        this._reqParam.location = '';
        this.getroGoodsList();
        break;
    }
  }

  // //获取商品详情接口
  getGoodsDetail(item){
    let param = {
      goodId: item.id,
      groupNumber: 11,
      storeId: item.storeId,
      roObj: this._roObj
    }
    this.goodsListService.getGoodsDetail(param).then(res => {
      if(utils.getStatusCode(res.code) == config.successCode){
        item.showInput = true;
        item.detail = res.data;
        this.showInupt(item);
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this.message.create('error', '网络加载失败');
    })
  }

  showInupt(item){
    // 判断最大限购数与库存   取小
    if(item.detail.maxQuantity <= item.detail.quantity){
      var maxCheck = item.detail.maxQuantity;
    }else{
      var maxCheck = item.detail.quantity;
    }
    if(item.detail.transactionRule == 2 && item.detail.isQuantityLimited == 1){
      item.disabled = true;
    }
    item.value = item.detail.miniQuantity;
    item.min = item.detail.miniQuantity;
    item.max = maxCheck;
    if(item.detail.transactionRule == 2){
      item.text = '立即购买';
    }else{
      item.text = '加入购物车';
    }
  }

  cancel(item){
    item.showInput = false;
  }

  addToCart(item){
    if(item.detail.transactionRule == 2){
      this._storageObj = [];
      utils.removceSessionStorage('storageObj');
    }

    let storageData = {
        'storeId': item.storeId,
        'goodsId': item.id,
        'count': item.value,
        'name': item.name,
        'miniQuantity': item.detail.miniQuantity,
        'maxQuantity': item.max
    };

    this._cartNumTotal += item.value;
    if(this._storageObj.length > 0){
      let lock = false;
      for(let it of this._storageObj){
        if(item.id == it.goodsId){
          it.count = parseInt(it.count) + item.value;
          if(it.count > it.maxQuantity){
            this._cartNumTotal =  this._cartNumTotal - it.count + it.maxQuantity;
            it.count = it.maxQuantity;
            this.notificationService.create('error',`${item.name}的购买数量超过最大值,将为您匹配最大数量${it.maxQuantity}`,'');
          }
          lock = true;
        }
      }
      if(lock == false){
        this._storageObj.push(storageData);
      }
    }else{
        this._storageObj.push(storageData);
    }
    item.showInput = false;
    if(item.detail.transactionRule == 2){
      utils.setSessionStorage('storageObj',this._storageObj)
      this.router.navigate(['/representingOrder/creatOrder'], {queryParams: {isCheck: this._switchValue}});
    }
  }


  // 购物车相关start
  showCartModal(){
    let _self = this;
    let modal = this.customModalService._content({
      title:'购物车编辑',
      content: ShoppingCartModalComponent,
      width: 600,
      closable: false,
      componentParams: {
        data: this._storageObj,
        cartNumTotal: this._cartNumTotal,
        switchValue: this._switchValue
      }
    });

    modal.subscribe(res => {
      if(typeof(res) == "number"){
        _self._cartNumTotal = res;
      }
     
    })
  }
  
  // 购物车相关end

  setLocal(){
    utils.setSessionStorage('storageObj',this._storageObj)
    this.router.navigate(['/representingOrder/creatOrder'], {queryParams: {isCheck: this._switchValue}});
  }


  goBack(){
    this.router.navigate(['/representingOrder/orderMsg'], {queryParams: {from: 'goodsList'}});
  }

}
