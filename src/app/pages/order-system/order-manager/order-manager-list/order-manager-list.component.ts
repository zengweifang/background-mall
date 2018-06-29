import { Component, OnInit } from '@angular/core';
import { NzMessageService} from 'ng-zorro-antd';
import { OrderManagerService } from '../order-manager.service';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import * as moment from 'moment';
import { OrderManagerListCapitalFlowModalComponent } from './order-manager-list-capital-flow-modal.component';
import { CustomModalService } from '../../../../shared/services/custom-modal.service';
@Component({
  selector: 'app-order-manager-list',
  templateUrl: './order-manager-list.component.html',
  styleUrls: ['./order-manager-list.component.css']
})
export class OrderManagerListComponent implements OnInit {
  _total = 0
  _loading = false
  _dataSet = []
  _startDate = null
  _endDate = null
  orderManagerListForm: FormGroup
  serviceOrderStatuses: any[] // 订单状态元数据
  payments: any[] // 支付方式元数据
  deliveryModes: any[] // 配送方式元数据
  cancelOrderReasons: any[] // 取消订单原因
  currentTab: number = 1;
  

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
  reqParam = {
    filter:{
      "storeName": "",
      "providerName": "",
      "providerId": "",
      "payNumber": "",
      "orderDataStartStr": "",
      "orderDataEndStr": "",
      "goodName": "",
      "orderId": "",
      "phone": "",
      "payType": null,         //参考表结构
      "deliveryMode": null,    //参考表结构
      "statusType": 11,      //参考表结构   暂时不全
      "orderSource": "",     //暂未定义				
      "orderType":"2"
    },
    orderBy: '-create_time',
    page:utils.pageParams()
  }

  _allChecked = false;
  _disabledButton = true;
  _checkedNumber = 0;
  _indeterminate = false;
  
  constructor(private orderManagerService:OrderManagerService,private fb: FormBuilder,private message: NzMessageService,private customModalService: CustomModalService) {

  }
  ngOnInit() {
    this.orderManagerListForm = this.fb.group({
      goodName: ['',],
      providerName: ['',],
      storeName: ['',],
      orderId: ['',],
      statusType: ['',],
      payType: ['',],
      deliveryMode: ['',],
      payNumber: ['',],
      phone: ['',],
      startDate: [null,],
      endDate: [null,],
    });
    this.getMetadata();
    this.refreshData(this.reqParam);
  }
  // 清除
  clear(){
    this.reqParam = {
      filter:{
        "storeName": "",
        "providerName": "",
        "providerId": "",
        "payNumber": "",
        "orderDataStartStr": "",
        "orderDataEndStr": "",
        "goodName": "",
        "orderId": "",
        "phone": "",
        "payType": null,         //参考表结构
        "deliveryMode": null,    //参考表结构
        "statusType": 11,      //参考表结构   暂时不全
        "orderSource": "",     //暂未定义				
        "orderType": ""
      },
      orderBy: '-create_time',
      page:utils.pageParams()
    },
    this.currentTab === 1 ? this.reqParam.filter.orderType = "2" : this.reqParam.filter.orderType = "1";
    this._startDate = null;
    this._endDate = null;
  }
  // 切换tab
  tabClick(tab){
    this.clear();
    if(tab.index == 1){
      this.currentTab = 1;
      this.reqParam.filter.orderType = "2";
      this.reqParam.page.currentPage = 1;
      this.reqParam.page.pageSize = 10;
      this.refreshData(this.reqParam);
    }else{
      this.currentTab = 2;
      this.reqParam.filter.orderType = "1";
      this.reqParam.page.currentPage = 1;
      this.reqParam.page.pageSize = 10;
      this.refreshData(this.reqParam);
    }
  }

  //条件搜索
  search(){
    this.reqParam.page.currentPage = 1;
    this.refreshData(this.reqParam);
  }

  refreshData(param){
    this._loading = true;
    param.filter.orderDataStartStr = this._startDate? utils.transformDateToString(this._startDate): '';
    param.filter.orderDataEndStr = this._endDate? utils.transformDateToString(this._endDate): '';
    this.orderManagerService.getList(param).then( res => {
      this._loading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        if(res.data){
          this._dataSet = res.data.list ? res.data.list : [];
          this._total = res.data.page.totalCount;

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
  
  //得到页面所需要的信息，比如下拉框的值等等
  getMetadata(){
      this.orderManagerService.metadata().then( res => {
        if(utils.getStatusCode(res.code) == config.successCode){
          this.serviceOrderStatuses = res.data.serviceOrderStatuses ? res.data.serviceOrderStatuses : [];
          this.payments = res.data.payments ? res.data.payments : [];
          this.deliveryModes = res.data.deliveryModes ? res.data.deliveryModes : [];
          this.cancelOrderReasons = res.data.cancelOrderReasons ? res.data.cancelOrderReasons : [];
        }else{
          this.message.create('error', res.message);
        }
      }).catch(err => {
        this.message.create('error', '网络加载失败');
      })
  }
  _startValueChange(){
    
  }

  _endValueChange(){
    
  };
  _disabledStartDate = (startValue) => {
    if (!startValue || !this._endDate) {
      return startValue && startValue.getTime() > Date.now();
    }
    return (startValue.getTime() >= this._endDate.getTime());
  };
  _disabledEndDate = (endValue) => {
    if (!endValue || !this._startDate) {
      return endValue && endValue.getTime() > Date.now();
    }
    return (endValue.getTime() <= this._startDate.getTime()) || (endValue && endValue.getTime() > Date.now());
  };


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


  // 资金流水弹窗
  getOrderPayList(item){
    this.customModalService._content({
      title: '资金流水',
      content: OrderManagerListCapitalFlowModalComponent,
      width: '50%',
      componentParams: {
        outData: item
      }
    });
  }


  // 取消订单
  cancelOrder(e){
    e && this.refreshData(this.reqParam);
  }


  //批量导出订单
  _patchExportData() {
      const orderIds = [];
      this._dataSet.forEach(element => {
          element.checked && orderIds.push(element.id);
      });
      let form1 = document.createElement("form");
      form1.id = "form1";
      form1.name = "form1";
      form1.target = "_blank";
      // form1.enctype = "";
      // 添加到 body 中 
      document.body.appendChild(form1);
      // 创建一个输入 
      let input = document.createElement("input");
      // 设置相应参数 
      input.type = "text";
      input.name = "orderIdReq";
      input.value = JSON.stringify({
          orderIds: orderIds,
          orderType: this.reqParam.filter.orderType
      });
      // 将该输入框插入到 form 中 
      form1.appendChild(input);
      // form 的提交方式 
      form1.method = "POST";
      // form 提交路径 
      form1.action = `${service.commonService}/background-manage/managerorder/downloadOrderIdExcel`;
      // 对该 form 执行提交 
      form1.submit();
      // 删除该 form 
      document.body.removeChild(form1);
  }

  //导出全部订单
  _exportAllData() {
      let form1 = document.createElement("form");
      form1.id = "form1";
      form1.name = "form1";
      form1.target = "_blank";
      // form1.enctype = "";
      // 添加到 body 中 
      document.body.appendChild(form1);
      // 创建一个输入 
      let input = document.createElement("input");
      // 设置相应参数 
      input.type = "text";
      input.name = "filter";
      input.value = JSON.stringify(this.reqParam.filter);
      // 将该输入框插入到 form 中 
      form1.appendChild(input);
      // form 的提交方式 
      form1.method = "POST";
      // form 提交路径 
      form1.action = `${service.commonService}/background-manage/managerorder/downloadFilterExcel`;
      // 对该 form 执行提交 
      form1.submit();
      // 删除该 form 
      document.body.removeChild(form1);

  }

}
