import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CodeHelperService } from '../../../../core/code-helper.service';
import { OperationListService } from '../operation-list.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import { utils } from '../../../../shared/utils/utils';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-channel-check-order',
  templateUrl: './channel-check-order.component.html',
  styleUrls: ['./channel-check-order.component.css']
})
export class ChannelCheckOrderComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private operationListService: OperationListService,
    private codeHelperService: CodeHelperService,
    private message: NzMessageService,
    private route: ActivatedRoute,
  ) { }

  validateForm: FormGroup;
  _loading = false;
  serviceOrderStatuses = [];
  goodsOrderStatuses = [];
  _dataSet = {
    list: [],
    page: { totalCount: 0 }
  }
  selectedTabIndex: number = 0;
  tabs = [
    {
      index: 1,
      tabName: '服务订单'
    },
    {
      index: 2,
      tabName: '实物商品订单'
    }
  ];

  channelId: string;
  channelName: string;

  isSelected = false;
  // exportButtonName = '全部导出';

  // 让子组件响应搜索点击事件，值为响应取反
  _goodSearchFlag = false;
  _serviceSearchFlag: any = '';
  _currentTabIndex = 1;


  // 让子组件响应导出点击事件，值为响应取反
  _goodExportFlag: any = '';
  _serviceExportFlag: any = '';

  isSelectedService = false;
  isSelectedGood = false;

  statusTypeOptions = [];

  goodsType: string = '';
  providerName = '';
  storeName = '';
  goodName;
  orderId;
  orderForm = '';
  payNumber;
  orderType: number = 2;
  payType = '';
  deliveryMode = '';
  phone;
  selectedStatusTypeOption = 11;
  // 订单来源
  channels = [];

  // orderTypeOptions = [{
  //   label: '服务订单',
  //   value: '2',
  // }, {
  //   label: '实物订单',
  //   value: '1',
  // },];

  deliveryModes = [];

  payments = [];

  ngOnInit() {
    this.validateForm = this.fb.group({
      payType: ['',],
      deliveryMode: ['',],
      storeName: ['',],
      providerName: ['',],
      goodsType: ['',],
      orderForm: ['',],
      goodName: ['',],
      orderId: ['',],
      statusType: [12,],
      payNumber: ['',],
      // orderType: [2,],
      phone: ['',],
      startDate: ['',],
      endDate: ['',],
      selectedStatusTypeOption: [11,],
      channelId: ['',],
    });
    this.channelId = this.route.snapshot.paramMap.get('channelId');
    this.channelName = this.route.snapshot.paramMap.get('channelName');
    let params = this.channelName ? this.operationListService.getOperationOrderManagementSearchCriteria() : this.operationListService.getOrderManagementSearchCriteria();
    if (params) {
      this.goodName = params.goodName;
      this.orderId = params.orderId;
      this.orderType = params.orderType;
      if (this.orderType === 1) {
        this.selectedTabIndex = 1;
      }
      // this._startDate=params._startDate;
      this.phone = params.phone;
      this.payNumber = params.payNumber;
      this.orderForm = params.orderForm;
      // this._endDate=params._endDate;
      this.providerName = params.providerName;
      this.storeName = params.storeName;
      this.goodsType = params.goodsType;
      this.selectedStatusTypeOption = params.selectedStatusTypeOption;
      // this.channelId = params.channelId;
      if (!this.channelName) {
        this.channelId = params.channelId;
      }
      this.payType = params.payType;
      this.deliveryMode = params.deliveryMode;
    }
    setTimeout(() => {
      this.search(null);
    }, 300);
    this.getMetaData();

  }

  _disabledDate = function (current) {
    return current && current.getTime() > Date.now();
  };

  resetForm() {
    this.validateForm.reset();
    // this.orderType = 2;
    this.selectedStatusTypeOption = 11;
    // this.oldFlag = this.orderType;
    // this.operationListService.cleanOrderManagementSearchCriteria();
    if (this.channelName) {
      this.operationListService.cleanOperationOrderManagementSearchCriteria();
    } else {
      this.operationListService.cleanOrderManagementSearchCriteria();
    }
    this.search(null);
  }

  export() {
    if (this._currentTabIndex === 1) {
      this._serviceExportFlag = !this._serviceExportFlag;
    } else if (this._currentTabIndex === 2) {
      this._goodExportFlag = !this._goodExportFlag;
    }
  }

  saveSearchParams() {
    const searchParams = {
      goodName: this.goodName,
      orderId: this.orderId,
      orderType: this.orderType,
      _startDate: this._startDate,
      phone: this.phone,
      payNumber: this.payNumber,
      orderForm: this.orderForm,
      _endDate: this._endDate,
      providerName: this.providerName,
      storeName: this.storeName,
      goodsType: this.goodsType,
      selectedStatusTypeOption: this.selectedStatusTypeOption,
      channelId: this.channelId,
      payType: this.payType,
      deliveryMode: this.deliveryMode,
    };
    if (this.channelName) {
      this.operationListService.setOperationOrdersManagementSearchCriteria(searchParams);
    } else {
      this.operationListService.setOrdersManagementSearchCriteria(searchParams);
    }
  }

  search(data) {
    // this.operationListService.setOrdersManagementSearchCriteria({
    //   goodName: this.goodName,
    //   orderId: this.orderId,
    //   orderType: this.orderType,
    //   _startDate: this._startDate,
    //   phone: this.phone,
    //   payNumber: this.payNumber,
    //   orderForm: this.orderForm,
    //   _endDate: this._endDate,
    //   providerName: this.providerName,
    //   storeName: this.storeName,
    //   goodsType: this.goodsType,
    //   selectedStatusTypeOption: this.selectedStatusTypeOption,
    //   channelId: this.channelId,
    //   payType: this.payType,
    //   deliveryMode: this.deliveryMode,
    // })
    this.saveSearchParams();
    if (this._serviceSearchFlag === '') {
      this._serviceSearchFlag = false;
    }
    this._serviceSearchFlag = !this._serviceSearchFlag;
  }

  onSelectedService(isSelectedService: boolean) {
    this.isSelected = isSelectedService;
    this.isSelectedService = isSelectedService;
  }

  onSelectedGood(isSelectedGood: boolean) {
    this.isSelected = isSelectedGood;
    this.isSelectedGood = isSelectedGood;
  }

  onShowError(showError: any) {
    this.message.create('error', showError);
  }

  oldFlag = this.orderType;

  orderTypeChange(tab) {
    let index = tab.index;
    if (index === 1) {
      this.orderType = 2;
    } else {
      this.orderType = 1;
    }
      setTimeout(() => {
        this.search(null);
      }, 100);
  }

  // getOrderStatus(status: any) {
  //   let options = [];
  //   for (const item in status) {
  //     if (status.hasOwnProperty(item)) {
  //       const element = status[item];
  //       options.push({
  //         'value': element.orderStatusType,
  //         'label': element.orderStatusName,
  //       })
  //     }
  //   }
  //   debugger;
  //   this.statusTypeOptions = options;
  //   this.selectedStatusTypeOption = this.statusTypeOptions[0];
  // }

  //得到页面所需要的信息，比如下拉框的值等等
  getMetaData() {
    this.operationListService.metadata(null).then(res => {
      if (!this.codeHelperService.isServerError(res) && res.data) {
        this.serviceOrderStatuses = res.data.serviceOrderStatuses;
        this.goodsOrderStatuses = res.data.goodsOrderStatuses;
        this.deliveryModes = res.data.deliveryModes;
        this.payments = res.data.payments;
        this.channels = res.data.channels;
        // this.getOrderStatus(this.serviceOrderStatuses);
      } else {
        this.message.create('error', '下拉框数据获取失败');
      }
    }
      // this.serviceOrderStatuses=res.data.serviceOrderStatuses;
      // _self.serviceOrderStatuses = orderSystemService.filterCustomerTab(res.data.serviceOrderStatuses);//过滤客服介入tab
    ).catch(error => {
      this.message.create('error', '下拉框数据获取失败');
    })
  }

  _startDate = null;
  _endDate = null;
  newArray = (len) => {
    const result = [];
    for (let i = 0; i < len; i++) {
      result.push(i);
    }
    return result;
  };
  _startValueChange = () => {
    if (this._startDate > this._endDate) {
      this._endDate = null;
    }
  };
  _endValueChange = () => {
    if (this._startDate > this._endDate) {
      this._startDate = null;
    }
  };
  _disabledStartDate = (startValue) => {
    if (!startValue || !this._endDate) {
      return startValue && startValue.getTime() > Date.now();
    }
    return (startValue.getTime() >= this._endDate.getTime()) || (startValue && startValue.getTime() > Date.now());
  };
  _disabledEndDate = (endValue) => {
    if (!endValue || !this._startDate) {
      return endValue && endValue.getTime() > Date.now();
    }
    return (endValue.getTime() <= this._startDate.getTime()) || (endValue && endValue.getTime() > Date.now());
  };
  get _isSameDay() {
    return this._startDate && this._endDate && moment(this._startDate).isSame(this._endDate, 'day')
  }
  get _endTime() {
    return {
      nzHideDisabledOptions: true,
      nzDisabledHours: () => {
        return this._isSameDay ? this.newArray(this._startDate.getHours()) : [];
      },
      nzDisabledMinutes: (h) => {
        if (this._isSameDay && h === this._startDate.getHours()) {
          return this.newArray(this._startDate.getMinutes());
        }
        return [];
      },
      nzDisabledSeconds: (h, m) => {
        if (this._isSameDay && h === this._startDate.getHours() && m === this._startDate.getMinutes()) {
          return this.newArray(this._startDate.getSeconds());
        }
        return [];
      }
    }
  }

  near(days: number) {
    let startDateAndEndDate = utils.getNearDay(days);
    this._endDate = startDateAndEndDate.endDate;
    this._startDate = startDateAndEndDate.startDate;
  }

}
