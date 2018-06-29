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
  selector: 'patch-resend-modal',
  templateUrl: './patch-resend-modal.component.html',
  styleUrls: ['./patch-resend-modal.component.css']
})
export class PatchResendModalComponent implements OnInit {
  constructor(
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private operationListService: OperationListService,
    private message: NzMessageService,
    private codeHelperService: CodeHelperService,
  ) { }

  @Input() dataList: any[];
  @Input() orderId: string;
  @Input() isPatch: boolean;


  ids: string[] = [];

  handleCancel(e) {
    this.subject.destroy('onCancel');
  }
  ngOnInit() {
    if (this.isPatch) {
      this.getGroupSubmitOrderInfo(this.orderId);
    } else {
      this.getOrderInfo({orderId: this.orderId});
    }
    this.ids = this.getPatchIds(this.dataList);
  }

  dataItems: any = {};
  orderServiceTimes: any = {};
  showServiceTimeToast: boolean = false;

  getOrderInfo(params: any): void {
    this.operationListService.getOrderInfo(params).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.dataItems = resp.data;
        this.updateTimeToast();
      } else {
        this.message.create('error', '订单信息获取失败');
      }
    }).catch(error => {
      this.message.create('error', '订单信息获取失败');
    });
  }

  getGroupSubmitOrderInfo(orderId: string): void {
    this.operationListService.getGroupOrderInfo(orderId).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.dataItems = resp.data;
        this.updateTimeToast();
      } else {
        this.message.create('error', resp.message ? resp.message : '订单信息获取失败');
      }
    }).catch(error => {
      this.message.create('error', '订单信息获取失败');
    })
  }

  updateTimeToast() {
    this.showServiceTimeToast = ((new Date(this.dataItems.deliveryTime)).getTime() < (new Date()).getTime());
  }

  getOrderAvailableServiceTimeList(ids: string[]): void {
    this.operationListService.getOrderAvailableServiceTimeList(ids).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.orderServiceTimes = resp.data;
      }
    }).catch(error => {
      this.message.create('error', '服务时间获取失败');
    })
  }

  isShowPickTime = false;
  updateTime() {
    this.getOrderAvailableServiceTimeList(this.ids);
    this.isShowPickTime = true;
  }

  pickTime(item: any, $event) {
    $event.stopPropagation();
    this.showServiceTimeToast = false;
    this.dataItems.deliveryTime = item.value;
    this.selectedServiceTime = item.value;
  }

  getPatchIds(dataList:any[]): string[] {
    let patchIds = [];
    dataList.forEach(item => {
      patchIds.push(item.orderId);
    })
    return patchIds;
  }

  selectedServiceTime = null;
  _submitForm() {
    const submitParams = {
      realOrderIds: this.ids,
      times: [],
      goodsNum: this.dataItems.count,
    };
    if (this.dataItems.isServiceInventory) {
      submitParams.times.push({
        'title': '服务时间',
        'value': Date.parse(new Date(this.selectedServiceTime).toString()),
      })
    } else {

    }
    this.operationListService
      .resendOrders(submitParams).then(resp => {
        if (!this.codeHelperService.isServerError(resp)) {
          this.message.create('success', '添加成功')
          this.subject.destroy('onOk');
        } else {
          this.message.create('error', resp.message ? resp.message : '添加失败');
        }
      }).catch(error => {
        this.message.create('error', '添加失败')
      });
  }
}