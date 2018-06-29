import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { CodeHelperService } from "../../../core/code-helper.service";
import { ChannelCheckOrderService } from "./channelCheckOrder.service";
import { NzMessageService } from 'ng-zorro-antd';
import { utils } from "../../../shared/utils/utils";
import * as moment from 'moment';

@Component({
  selector: 'app-channel-check-order',
  templateUrl: './channel-check-order.component.html',
  styleUrls: ['./channel-check-order.component.css']
})
export class ChannelCheckOrderComponent implements OnInit {
  validateForm: FormGroup;
  searchArray = ["服务名称", "订单号", "订单状态", "交易单号", "手机号", "开始时间", "结束时间"]
  controlArray = [];
  isCollapse = true;
  searchParams = {};
  _loading = false;
  serviceOrderStatuses = [];
  goodsOrderStatuses = [];
  _dataSet = {
    list: [],
    page: { totalCount: 0 }
  }
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

  isSelected = false;
  // exportButtonName = "全部导出";

  // 让子组件响应搜索点击事件，值为响应取反
  _goodSearchFlag = false;
  _serviceSearchFlag = false;
  _currentTabIndex = 1;


  // 让子组件响应导出点击事件，值为响应取反
  _goodExportFlag:any = '';
  _serviceExportFlag:any = '';
  
  isSelectedService = false;
  isSelectedGood = false;

  statusTypeOptions = [];

  goodName;
  orderId;
  payNumber;
  orderType = '2';
  phone;
  selectedStatusTypeOption;

  orderTypeOptions = [{
    label: "服务订单",
    value: '2',
  },{
    label: "实物订单",
    value: '1',
  },]

  constructor(
    private fb: FormBuilder,
    private channelCheckOrderService: ChannelCheckOrderService,
    private codeHelperService: CodeHelperService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      goodName: ['',],
      orderId: ['',],
      statusType: [11,],
      payNumber: ['',],
      orderType: ['2',],
      phone: ['',],
      startDate: ['',],
      endDate: ['',],
    });
    this.getMetaData();

  }

  _disabledDate = function (current) {
    return current && current.getTime() > Date.now();
  };

  // toggleCollapse() {
  //   this.isCollapse = !this.isCollapse;
  //   this.controlArray.forEach((c, index) => {
  //     c.show = this.isCollapse ? (index < 6) : true;
  //   })
  // }

  resetForm() {
    this.validateForm.reset();
    this.orderType = '2';
    this.oldFlag = this.orderType;
  }

  export() {
    if (this._currentTabIndex === 1) {
      this._serviceExportFlag = !this._serviceExportFlag;
    } else if (this._currentTabIndex === 2) {
      this._goodExportFlag = !this._goodExportFlag;
    }
  }

  search(data) {
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

  tabClick(tab) {
    this._currentTabIndex = tab.index;
    if (tab.index === 1) {
      this.isSelected = this.isSelectedService;
      this.getOrderStatus(this.serviceOrderStatuses);
    } else {
      this.isSelected = this.isSelectedGood;
      this.getOrderStatus(this.goodsOrderStatuses);
    }
  }

  oldFlag = this.orderType;

  orderTypeChange($event) {
    if (!$event && this.oldFlag != this.orderType) {
      this.oldFlag = this.orderType;
      setTimeout(() => {
        this.search(null);
      }, 300);
    }
  }

  getOrderStatus(status:any) {
    let options = [];
    for (const item in status) {
      if (status.hasOwnProperty(item)) {
        const element = status[item];
        options.push({
          'value': element.orderStatusType,
          'label': element.orderStatusName,
        })
      }
    }
    this.statusTypeOptions = options;
    this.selectedStatusTypeOption = this.statusTypeOptions[0];
  }

  //得到页面所需要的信息，比如下拉框的值等等
  getMetaData() {
    this.channelCheckOrderService.metadata().then(res => {
      if (!this.codeHelperService.isServerError(res) && res.data) {
        this.serviceOrderStatuses = res.data.serviceOrderStatuses;
        this.goodsOrderStatuses = res.data.goodsOrderStatuses;
        this.getOrderStatus(this.serviceOrderStatuses);
      }
    }
      // this.serviceOrderStatuses=res.data.serviceOrderStatuses;
      // _self.serviceOrderStatuses = orderSystemService.filterCustomerTab(res.data.serviceOrderStatuses);//过滤客服介入tab
    )
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
  near(days:number) {
    let startDateAndEndDate = utils.getNearDay(days);
    this._endDate = startDateAndEndDate.endDate;
    this._startDate = startDateAndEndDate.startDate;
  }
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


}
