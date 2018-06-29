import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { OperationListService } from '../../../operation-list.service';
import { NzMessageService } from 'ng-zorro-antd';
import { CodeHelperService } from "../../../../../../core/code-helper.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { error } from 'util';


@Component({
  selector: 'place-order-modal',
  templateUrl: './place-order-modal.component.html',
  styleUrls: ['./place-order-modal.component.css']
})
export class PlaceOrderModalComponent implements OnInit {
  constructor(
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private operationListService: OperationListService,
    private message: NzMessageService,
    private codeHelperService: CodeHelperService,
  ) { }

  @Input() dataList: any[];
  @Input() orderId: string;
  @Input() goodId: string;
  @Input() storeId: string;
  @Input() checkLocation: boolean;

  // 是否特殊订单=开启校验服务范围 ？否 ： 是
  isSpecialOrder: boolean;

  submitParams = {
    goodsId: '',
    operation: 2,//1:重新提交订单，2:重新生成订单，3:取消订单
    orderId: '',
    goodsNum: '',
    times: [],
    storeId: '',
    isSpecialOrder: false
  };
  ids: string[] = [];

  handleCancel(e) {
    this.subject.destroy('onCancel');
  }
  ngOnInit() {
    this.getOrderInfo({
      orderId: this.orderId,
      goodId: this.goodId,
      storeId: this.storeId
    });
    this.submitParams.orderId = this.orderId;
    this.submitParams.goodsId = this.goodId;
    this.submitParams.storeId = this.storeId;
    this.isSpecialOrder = !this.checkLocation;
    this.submitParams.isSpecialOrder = !this.checkLocation;
    this.ids = this.getPatchIds(this.dataList);
  }

  dataItems: any = {};
  orderServiceTimes: any = {};
  showServiceTimeToast: boolean = false;

  getOrderInfo(params: any): void {
    this.operationListService.getOrderInfo(params).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.dataItems = resp.data;
        this.maxCount = Math.min(this.dataItems.maxOrders, this.dataItems.quantity);
        this.updateTimeToast();
        this.updateCountTips();
      } else {
        this.message.create('error', '订单信息获取失败');
      }
    }).catch(error => {
      this.message.create('error', '订单信息获取失败');
    });
  }

  upadteCountToast() {
    this.isShowCountToast = (this.dataItems.count < this.dataItems.minOrders || this.dataItems.count > this.maxCount);
  }

  updateCountTips() {
    this.countTips = this.dataItems.maxOrders <= this.dataItems.quantity ? 
      `(最小购买份数:${this.dataItems.minOrders},最大购买份数:${this.dataItems.maxOrders})` : `(总库存:${this.dataItems.quantity})`;
  }

  updateTimeToast() {
    this.showServiceTimeToast = ((new Date(this.dataItems.deliveryTime)).getTime() < (new Date()).getTime());
  }

  getOrderAvailableServiceTimeList(params: any): void {
    this.operationListService.getOrderAvailableServiceTime(params).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.orderServiceTimes = resp.data;
      }
    }).catch(error => {
      this.message.create('error', '服务时间获取失败');
    })
  }

  isShowPickTime = false;
  editTime = false;
  tempTime: Date = null;
  editCountFlag = false;
  tempCount: number;
  countTips: string;
  isShowCountToast: boolean = false;
  maxCount: number;

  editCount() {
    this.editCountFlag = true;
    this.tempCount = this.dataItems.count;
  }

  saveCount(count: number) {
    this.dataItems.count = count;
    this.editCountFlag = false;
    this.upadteCountToast();
  }

  saveTime() {
    this.dataItems.deliveryTime = this.js_yyyy_mm_dd_hh_mm_ss(this.tempTime);
    this.editTime = false;
  }

  js_yyyy_mm_dd_hh_mm_ss(inputDate: Date) {
    let year = "" + inputDate.getFullYear();
    let month = "" + (inputDate.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    let day = "" + inputDate.getDate(); if (day.length == 1) { day = "0" + day; }
    let hour = "" + inputDate.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    let minute = "" + inputDate.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    let second = "" + inputDate.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  }

  updateTime() {
    if (this.isSpecialOrder) {
      // 普通修改时间
      this.tempTime = new Date(this.dataItems.deliveryTime);
      console.log('normal');
      this.editTime = true;
    } else {
      // 请求后台时间数据
      this.getOrderAvailableServiceTimeList({
        "goodId": this.dataItems.goodId, //商品id
        "storeId": this.dataItems.storeId, //店铺id
        "regionCode": this.dataItems.regionCode, // 服务地址行政编码
        "price": this.dataItems.price, //商品价格
        "count": this.dataItems.count, //商品数量
        "sourceType": 0, //订单来源平台类型 0-没设置 1-app 2-点评渠道 3-代客下单 4-h5商城
        "providerId": this.dataItems.providerId,
        "deliveryAddress": this.dataItems.address
      });
      this.isShowPickTime = true;
    }
  }

  pickTime(item: any, $event) {
    $event.stopPropagation();

    this.showServiceTimeToast = false;
    this.dataItems.deliveryTime = item.value;
    this.selectedServiceTime = item.value;
  }

  getPatchIds(dataList: any[]): string[] {
    let patchIds = [];
    dataList.forEach(item => {
      patchIds.push(item.orderId);
    })
    return patchIds;
  }

  selectedServiceTime = null;

  _submitForm() {
    this.submitParams.goodsNum = this.dataItems.count;
    if (this.dataItems.isServiceInventory) {
      this.submitParams.times.push({
        'title': '服务时间',
        'value': this.isSpecialOrder ? Date.parse(this.dataItems.deliveryTime) : Date.parse(new Date(this.selectedServiceTime).toString()),
      })
    } else {
      console.log('属性小组');
    }
    this.operationListService
      .manageDistributionOrder(this.submitParams).then(resp => {
        if (!this.codeHelperService.isServerError(resp)) {
          this.message.create('success', '操作成功')
          this.subject.destroy('onOk');
        } else {
          this.message.create('error', resp.message ? resp.message : '操作失败');
        }
      }).catch(error => {
        this.message.create('error', '操作失败')
      });
  }
}