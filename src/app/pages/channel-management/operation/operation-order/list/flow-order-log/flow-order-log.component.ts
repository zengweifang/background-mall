import { Component, Input, OnInit } from '@angular/core';
import { OperationListService } from '../../../operation-list.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CodeHelperService } from "../../../../../../core/code-helper.service";
import { PatchResendModalComponent } from "./patch-resend-modal.component";
import { PlaceOrderModalComponent } from "./place-order-modal.component";
import { CancelOrderModalComponent } from "./cancel-order-modal.component";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { error } from 'util';
import { ActivatedRoute } from '@angular/router';
import { getPageParams } from '../../../../../../core/page.config';
import { Location } from '@angular/common';


@Component({
  selector: 'flow-order-log',
  templateUrl: './flow-order-log.component.html',
  styleUrls: ['./flow-order-log.component.css']
})
export class FlowOrderLogComponent implements OnInit {
  constructor(
    private operationListService: OperationListService,
    private codeHelperService: CodeHelperService,
    private message: NzMessageService,
    private rute: ActivatedRoute,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private location: Location
  ) {

  }
  validateForm: FormGroup;

  id: string = '';
  orderId: string = '';
  channelName: string = '';
  goodsTypeId: string = '';
  // 是否校验服务范围
  checkLocation: boolean = true;

  loading: boolean = false;
  metadata: any = null;
  prividersNum: any = {
    reorder: 0,
    providers: 0,
  };
  logData: any = {
    virtualOrderStatus: 0,
    logs: null,
    errLog: null,
  };
  dianpingData: any = null;

  ngOnInit() {
    this.validateForm = this.fb.group({
      goodsName: ['',],
      goodsTypeName: ['',],
      providerName: ['',],
      storeName: ['',],
      checkLocation: [true,],
    });
    this.id = this.rute.snapshot.paramMap.get('id');
    this.orderId = this.rute.snapshot.paramMap.get('orderId');
    this.channelName = this.rute.snapshot.paramMap.get('channelName');
    this.goodsTypeId = this.rute.snapshot.paramMap.get('goodsTypeId');
    this.params.orderId = this.orderId;
    this.params.goodsTypeId = this.goodsTypeId;
    this.refreshData();
    this.getMetaData();
  }

  refreshData() {
    this.getGroupOrderOperationLog(this.orderId);
    if (this.channelName === 'dianping') {
      this.getDianpingOrderStatus(this.orderId);
    }
    this.getCountOfTakingAndReorder(this.orderId);
  }

  _allChecked = false;
  _indeterminate = false;
  _displayData = [];

  _displayDataChange($event) {
    this._displayData = $event;
    this._refreshStatus();
  }

  _refreshStatus() {
    let allChecked = true;
    this.logData.logs.forEach(item => {
      if (!item.orderLogs.every(value => value.disabled || value.checked)) {
        allChecked = false;
      }
    });
    let allUnChecked = true;
    this.logData.logs.forEach(item => {
      if (!item.orderLogs.every(value => value.disabled || !value.checked)) {
        allUnChecked = false;
      }
    });
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
  }

  _checkAll(value) {
    if (value) {
      this.logData.logs.forEach(item => {
        item.orderLogs.forEach(data => {
          if (!data.disabled) {
            data.checked = true;
          }
        })
      });
    } else {
      this.logData.logs.forEach(item => {
        item.orderLogs.forEach(data => data.checked = false)
      });
    }
    this._refreshStatus();
  }

  getMetaData() {
    this.operationListService.metadata(null).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.metadata = resp.data;
      } else {
        this.message.create('error', '加载失败');
      }
    }).catch(error => {
      this.message.create('error', '加载失败');
    });
  }

  // 获取订单流程  orderType 订单来源(1:重新提交订单  2:重新生成订单 3:自动派单)
  getGroupOrderOperationLog(orderId: string): void {
    this.loading = true;
    this.operationListService.getGroupOrderOperationLog(orderId).then(resp => {
      this.loading = false;
      if (!this.codeHelperService.isServerError(resp)) {
        this.logData = resp.data;
        this.params.location = this.logData.location;
        this.logData.logs.forEach(item => {
          item.orderLogs.forEach(data => {
            if (!((this.logData.virtualOrderStatus == 23 || this.logData.virtualOrderStatus == 31 || this.logData.virtualOrderStatus == 425) && data.reorder)) {
              data.disabled = true;
            }
          })
        });
      } else {
        this.message.create('error', '加载失败');
      }
    }).catch(error => {
      this.loading = false;
      this.message.create('error', '加载失败');
    })
  }

  getDianpingOrderStatus(orderId: string): void {
    this.operationListService.getDianpingOrderStatus(orderId).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.dianpingData = resp.data;
      } else {
        this.message.create('error', resp.data.message ? resp.data.message : '点评订单状态加载失败');
      }
    }).catch(error => {
      this.message.create('error', '点评订单状态加载失败');
    });
  }

  getCountOfTakingAndReorder(orderId: string): void {
    this.operationListService.getCountOfTakingAndReorder(orderId).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.prividersNum = resp.data;
      } else {
        this.message.create('error', '加载失败');
      }
    }).catch(error => {
      this.message.create('error', '加载失败');
    });
  }

  // 单个发起订单
  newResendOrders(item: any): void {
    this.goResendOrders([item], item.orderId, false);
  }

  // 批量重新发起订单
  newPatchResendOrders(datas: any): void {
    let checkedItems = [];
    this.logData.logs.forEach(item => {
      item.orderLogs.forEach(data => {
        if (data.checked) {
          checkedItems.push(data)
        }
      })
    });
    this.goResendOrders(checkedItems, this.orderId, true);
  }

  goResendOrders(items: any[], orderId: string, isPatch: boolean): void {
    const subscription = this.modalService.open({
      title: '重新发起订单',
      content: PatchResendModalComponent,
      onOk() {
      },
      onCancel() {

      },
      footer: false,
      componentParams: {
        dataList: items,
        orderId: orderId,
        isPatch: isPatch,
      },
      width: '700px',
    });
    subscription.subscribe(result => {
      if (result === 'onOk') {
        this.refreshData();
      }
    })
  }

  // 取消自动派单／抢单
  toCancelAutoSendOrder(): void {
    this.operationListService.cancelAutoGetOrders([this.orderId]).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.message.create('success', resp.message ? resp.message : '操作成功');
        this.refreshData();
      } else {
        this.message.create('error', resp.message ? resp.message : '取消失败');
      }
    }).catch(error => {
      this.message.create('error', '取消失败');
    })
  }

  params = {
    orderId: '',
    page: getPageParams(),
    goodsTypeId: '',
    townCode: '',
    goodsName: '',
    goodsTypeName: '',
    providerName: '',
    storeName: '',
    location: '',
  };
  _total = 0;
  _loading = true;
  // _params = {
  //   orderId: this.orderId,
  // 	page: getPageParams(),
  // 	channelId: '',
  // 	goodsName: '',
  // 	goodsType: '',
  // 	providerName: '',
  // 	isVirtual: 0, // 初始为0   代表真实商品  
  // }

  turn(status: true | false): void {
    if (status) {
      this.params.location = this.logData.location;
      this.params.townCode = this.logData.townCode;
      this.getProvider(true);
    } else {
      this.params.townCode = '';
      this.params.location = '';
      this.getProvider(true);
    }
  }
  cateTip = "     ";

  getGoodsType(item: any) {
    this.operationListService.getGoodsType(item.goodTypeId).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.cateTip = resp.data;
      } else {
        this.message.create('error', resp.message ? resp.message : '品类获取失败');
      }
    }).catch(error => {
      this.message.create('error', '品类获取失败');
    })
  }

  showTip($event, item: any) {
    if ($event) {
      this.getGoodsType(item);
    } else {
      this.cateTip = "     ";
    }
  }
  resetForm($event: MouseEvent) {
    $event.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
    }
  }
  search($event: MouseEvent) {
    this.getProvider(true);
  }


  realGoodsList = [];
  isShowRealGoods = false;

  // 人工派单
  artificialOrder() {
    this.isShowRealGoods = true;
    try {
      document.querySelector('#realGoods').scrollIntoView();
    } catch (e) {
      console.log(e);
    }
    if (!this.realGoodsList.length) {
      this.getProvider(true);
    }
  }

  // 获取人工派单商品列表
  getProvider(reset: boolean = false) {
    if (reset) {
      this.params.page.currentPage = 1;
    }
    // 真实商品参数
    this._loading = true;
    this.operationListService.getRealGoodsList(this.params).then(resp => {
      this._loading = false;
      if (!this.codeHelperService.isServerError(resp)) {
        this.realGoodsList = resp.data.goods;
        this._total = resp.data.page.totalCount;
      } else {
        this.message.create('error', resp.message ? resp.message : '获取失败');
      }
    }).catch(error => {
      this._loading = false;
      this.message.create('error', '获取失败');
    });
  }

  // 弹出立即下单
  placeOrder(item: any): void {
    const subscription = this.modalService.open({
      title: '立即下单',
      content: PlaceOrderModalComponent,
      onOk() {
      },
      onCancel() {

      },
      footer: false,
      componentParams: {
        dataList: [item],
        orderId: this.orderId,
        storeId: item.storeId,
        goodId: item.id,
        checkLocation: this.checkLocation,
      },
      width: '700px',
    });
    subscription.subscribe(result => {
      if (result === 'onOk') {
        this.refreshData();
      }
    })
  }

  showCancelOrderCanfirm = () => {
    this.modalService.confirm({
      title  : '您是否确认要取消',
      content: '',
      showConfirmLoading: true,
      onOk() {
        this.toQuickCancelOrder();
      },
      onCancel() {

      }
    });
  }

  showCanfirmByType(type: number): void {
    this.modalService.confirm({
      title  : type === 3 ? '是否确定完成订单？' : '您是否确认要取消?',
      content: '',
      showConfirmLoading: true,
      onOk() {
        this.cancelReceiveOrder({
          orderId: this.orderId,
          opType: type,
        })
      },
      onCancel() {

      }
    });
  }

  cancelReceiveOrder(params: any): void {
    this.operationListService.cancelReceiveOrder(params).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.message.create('success', resp.message ? resp.message : '操作成功');
        this.refreshData();
      } else {
        this.message.create('error', resp.message ? resp.message : '取消失败');
      }
    }).catch(error => {
      this.message.create('error', '取消失败');
    })
  }

  toQuickCancelOrder(): void {
    const subscription = this.modalService.open({
      title: '快捷取消订单',
      content: CancelOrderModalComponent,
      onOk() {
      },
      onCancel() {
      },
      footer: false,
      componentParams: {
        metadata: this.metadata,
        orderId: this.orderId,
      },
    });
    subscription.subscribe(result => {
      if (result === 'onOk') {
        this.refreshData();
      }
    })
  }

  goBack() {
    this.location.back();
  }

}