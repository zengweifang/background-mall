import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import { Router,ActivatedRoute } from '@angular/router';
import { utils } from '../../../shared/utils/utils';
import { config, service } from '../../../core/core.config';
import { CreatOrderService } from './creat-order.service';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import { LOADINGOPEN, LOADINGCLOSE } from "../../../shared/reducer/page-load";
import { CustomModalService } from '../../../shared/services/custom-modal.service';
@Component({
  selector: 'app-creat-order',
  templateUrl: './creat-order.component.html',
  styleUrls: ['./creat-order.component.scss']
})
export class CreatOrderComponent implements OnInit {
  _validateForm: FormGroup;
  _roObj = utils.getSessionStorage('roObj');
  _goodsStorageObj = utils.getSessionStorage('storageObj');
  _isCheck: boolean = false;
  _totalCount: number = 0;
  _orderInfo = {
    storeOrders: [],
    baseMoney: {
      originMoney: 0,
      freight: 0,
      subTotalMoney: 0
    },
    processInstanceId: ''
  }
  _reqParam = {
    "appId": this._roObj.appId,
    "addressId": this._roObj.addressId,
    "userId": this._roObj.userId,
    "goodsItems": this._goodsStorageObj,
    'outTradeNo': this._roObj.outTradeNo,
    "serviceSubscriptionId": this._goodsStorageObj[0].serviceSubscriptionId,
    'serviceSubscriptionSource': this._goodsStorageObj[0].serviceSubscriptionSource,
    "isSupportedServiceTime": true,
    "isSpecialOrder": false, 
    //订单来源平台，取值为：1——App, 2——点评渠道，3——待客下单，4——H5商城。默认为1  >>>>>> 改为3
    "sourceType":3
  }
  _orderServiceTimes = [];
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router:Router,
    private store: Store<AppState>,
    private creatOrderService: CreatOrderService,
    private activatedRoute:ActivatedRoute
  ) {
    if(this.activatedRoute.snapshot.queryParamMap.get('isCheck') == 'true'){
      this._isCheck = true;
    }else{
      this._isCheck = false;
    }
    this._reqParam.isSpecialOrder = this._isCheck;
  }

  ngOnInit() {
    this._validateForm = this.fb.group({
      remark: [''],
      deliveryTime: [null]
    });

    this.getCreatedOrder();
    this.getTotalCount();

    
  }

  getTotalCount(){
    for(let item of this._goodsStorageObj){
      this._totalCount += parseInt(item.count);
    }
  }

  //创建订单接口
  getCreatedOrder(){
    this.store.dispatch({type: LOADINGOPEN});
    this.creatOrderService.getOrderService(this._reqParam).then(res => {
      this.store.dispatch({type: LOADINGCLOSE});
      if(utils.getStatusCode(res.code) == config.successCode){
        if(res.data){
          this._orderInfo = res.data;
          this._orderInfo.baseMoney.freight = Math.round(this._orderInfo.baseMoney.freight * 100) / 100;
          this._orderInfo.baseMoney.subTotalMoney = Math.round(this._orderInfo.baseMoney.subTotalMoney * 100) / 100;
          for(let i of this._orderInfo.storeOrders){
            for(let j of i.orderItemList){
              if(j.goodsAttributeList){
                for(let z of j.goodsAttributeList){
                  if(z.attributeDefineName == '服务时间' || z.attributeDefineName == '开始时间' || z.attributeDefineName == '结束时间'){
                    z.showTime = true;
                    z.value = null
                    switch(z.timeScope){
                      case 0:
                        z.format = 'MM-DD HH:mm';
                        break;
                      case 1:
                        z.format = 'MM-DD HH';
                        break;
                      case 2:
                        z.format = 'MM-DD';
                        break;
                      case 3:
                        z.format = 'MM';
                        break;
                    }
                  }else{
                    z.showTime = false;
                    z.value = null
                  }
                }
              }
            }
          }
          utils.setSessionStorage('processInstanceId',res.data.processInstanceId);
          // 如果storeOrders中有needServiceTime 则通过processInstanceId请求服务时间
          for(let item of res.data.storeOrders){
            console.log(this._isCheck)
            if(item.needServiceTime && this._isCheck){
              this.getOrderServiceTimes(res.data.processInstanceId);
              break;
            }
          }
          
        }
      }else{
        this.message.create('error', res.message);
        this.router.navigate(['/representingOrder/goodsList'])
      }
    }).catch(err => {
      console.log(err)
      this.store.dispatch({type: LOADINGCLOSE});
      this.message.create('error', '网络加载失败');
    })
  }

  getOrderServiceTimes(id){
    this.creatOrderService.getOrderServiceTimes(id).then(res => {
      if(utils.getStatusCode(res.code) == config.successCode){
        if(res.data){
          this._orderServiceTimes = res.data;
          for(let i of this._orderServiceTimes){
            for(let j in i.items){
              if(i.items[j].enabled){
                i.showText = false;
                break;
              }
              if(Number(j) == i.items.length - 1){
                i.showText = true;
              }
            }
          }
        }
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      console.log(err)
      this.message.create('error', '网络加载失败');
    })
  }

  pickTime(item){
    for(let i of this._orderServiceTimes){
      for(let j of i.items){  
        j.activeIsTrue = false;
      }
    }
    item.activeIsTrue = true;
  }

  getSubmitObj(){
    return new Promise((resolve,reject) => {
      let submitObj = {
        userId: this._roObj.userId,
        processInstanceId: this._orderInfo.processInstanceId,
        addressId: this._roObj.addressId,
        appId: this._roObj.appId,
        sourceType: 3,
        storeOrders: []
      };
      this._orderInfo.storeOrders.forEach((item,i) => {
        let storeOrdersObj = {
          id: item.id,
          storeId: item.storeId,
          deliveryModeType: item.deliveryModeType,
          remark: item.remark,
          deliveryTimeStart: null,
          orderItemList: []
        }
        if(item.needServiceTime){
          if(this._isCheck){
            for(let z of this._orderServiceTimes){
              for(let j of z.items){
                if(j.activeIsTrue){
                  storeOrdersObj.deliveryTimeStart = j.value
                  break;
                }
              }
            }
          }else{
            let oDate = utils.transformDateToString(item.deliveryTimeStart);
            storeOrdersObj.deliveryTimeStart = oDate
          }
        }
        submitObj.storeOrders.push(storeOrdersObj);
        item.orderItemList.forEach((it,q) => {
          let storeOrdersOrderItemListObj = {
            id: it.id,
            itemId: it.itemId,
            storeId: it.storeId,
            goodsAttributeList: []
          }
          storeOrdersObj.orderItemList.push(storeOrdersOrderItemListObj);
          if(it.goodsAttributeList){
            it.goodsAttributeList.forEach((element,h) => {
              let storeOrdersOrderItemListGoodsAttributeListObj = {
                attributeGroupId: element.attributeGroupId,
                attributeDefineName: element.attributeDefineName,
                attributeDefineId: element.attributeDefineId,
                value: ''
              }
              if(typeof(element.value) == 'object'){
                let oDate
                switch(element.timeScope){
                  case 0:
                    oDate = `${utils.getTempDate((element.value.getMonth() + 1))}-${utils.getTempDate(element.value.getDate())} ${utils.getTempDate(element.value.getHours())}:${utils.getTempDate(element.value.getMinutes())}`;
                    break;
                  case 1:
                    oDate = `${utils.getTempDate((element.value.getMonth() + 1))}-${utils.getTempDate(element.value.getDate())} ${utils.getTempDate(element.value.getHours())}`;
                    break;
                  case 2:
                    oDate = `${utils.getTempDate((element.value.getMonth() + 1))}-${utils.getTempDate(element.value.getDate())}`;
                    break;
                  case 3:
                    oDate = `${utils.getTempDate((element.value.getMonth() + 1))}`;
                    break;
                }
                storeOrdersOrderItemListGoodsAttributeListObj.value = oDate;
              }else{
                storeOrdersOrderItemListGoodsAttributeListObj.value = element.value;
              }
              
              storeOrdersOrderItemListObj.goodsAttributeList.push(storeOrdersOrderItemListGoodsAttributeListObj);
            });
          }
        });
      });
      resolve(submitObj)
    })
    
  }

  //确认订单接口
  confirmCreatedOrder(data){
    this.getSubmitObj().then(data => {
      this.store.dispatch({type: LOADINGOPEN});
      this.creatOrderService.confirmOrderService(data).then(res => {
        this.store.dispatch({type: LOADINGCLOSE});
        if(utils.getStatusCode(res.code) == config.successCode){
          this.message.create('success', '提交成功');
          this.router.navigate(['/orderSystem/orderManager/serviceOrderList'])
        }else{
          if(res.message == '传入参数错误'){
            this.message.create('error', '请完善订单信息');
          }else{
            this.message.create('error', res.message);
          }
          
        }
      }).catch(err => {
        console.log(err)
        this.store.dispatch({type: LOADINGCLOSE});
        this.message.create('error', '网络加载失败');
      })
    })
    
  }

  valueChange(){
    
  }

  goBack(){
    this.router.navigate(['/representingOrder/goodsList'])
  }

}
