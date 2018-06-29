import { Component, OnInit } from '@angular/core';
import { NzMessageService} from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { FormBuilder, FormGroup } from "@angular/forms";
import { SupplierManageService } from '../../supplier-manage.service';
@Component({
  selector: 'app-supplier-audit-business-list',
  templateUrl: './supplier-audit-business-list.component.html',
  styleUrls: ['./supplier-audit-business-list.component.scss']
})
export class SupplierAuditBusinessListComponent implements OnInit {

  _tabs = [
    {
      index: 0,
      tabName: '待审核'
    },
    {
      index: 1,
      tabName: '审核通过'
    },
    {
      index: 2,
      tabName: '审核未通过'
    }
  ]
  _from: string
  _reqParam = {
      "status": 1, //审核状态（1：待审核   2：通过   3：未通过）
      "createTimeEnd": "", //时间格式 搜索提交时间-结束时间
      "createTimeStart": "", //时间格式 搜索提交时间-开始时间
      "verifyTimeEnd": "", //时间格式 搜索审核时间-结束时间
      "verifyTimeStart": "", //时间格式 搜索审核时间-开始时间
      "storesName": "", //搜索店铺名称
      "serviceName": "", //搜索供应商名称
      page: utils.pageParams(),
  };
  _total: number = 0
  _loading: boolean = false
  _dataSet = []
  _currentTab: number = 0;
  _supplierAuditBusinessListForm: FormGroup
  _createTimeStartDate = null
  _createTimeEndDate = null
  _verifyTimeStartDate = null
  _verifyTimeEndDate = null
  constructor(private fb: FormBuilder,private message: NzMessageService,private supplierManageService: SupplierManageService,private router:Router,private activatedRoute: ActivatedRoute) {
    this._from = this.activatedRoute.snapshot.queryParamMap.get('from');
  }

  ngOnInit() {
    this._supplierAuditBusinessListForm = this.fb.group({
      serviceName: ['',],
      storeName: ['',],
      createTimeStartDate: [null,],
      createTimeEndDate: [null,],
      verifyTimeStartDate: [null,],
      verifyTimeEndDate: [null,]
    });
    // initTabs
    let supplierAuditBusinessBasicInitTab = utils.getSessionStorage('supplierAuditBusinessBasicInitTab');
    if(!supplierAuditBusinessBasicInitTab || this._from != 'detail'){
        supplierAuditBusinessBasicInitTab = 'audit';
    }
    switch(supplierAuditBusinessBasicInitTab){
        case 'audit':
          this._currentTab = 0;
          this._reqParam.status = 1;
          this._reqParam.page.currentPage = 1;
          break;
        case 'pass':  
          this._currentTab = 1;
          this._reqParam.status = 2;
          this._reqParam.page.currentPage = 1;
          break;
        case 'failure':  
          this._currentTab = 2;
          this._reqParam.status = 3;
          this._reqParam.page.currentPage = 1;
          break;
    }
    this.clear();
    this.refreshData(this._reqParam);
  }
  refreshData(param){
    this._loading = true;
    param.createTimeStart = utils.transformDateToString(this._createTimeStartDate);
    param.createTimeEnd = utils.transformDateToString(this._createTimeEndDate);
    param.verifyTimeStart = utils.transformDateToString(this._verifyTimeStartDate);
    param.verifyTimeEnd = utils.transformDateToString(this._verifyTimeEndDate);
    this.supplierManageService.getStoreAreaVerifyPage(param).then( res => {
      this._loading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        if(res.data){
          this._dataSet = res.data.storeAreaVerifyDtoList;
          this._total = res.data.page.totalCount ? res.data.page.totalCount : 0;
        }else{
          this._dataSet = [];
        }
        
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this._loading = false;
      this.message.create('error', '网络加载失败');
    })
  }

  // 切换tab
  tabClick(tab){
    this.clear();
    switch (tab.index) {
      case 0 : 
        utils.setSessionStorage('supplierAuditBusinessBasicInitTab','audit')
        this._currentTab = 0;
        this._reqParam.status = 1;
        this._reqParam.page.currentPage = 1;
        this._reqParam.page.pageSize = 10;
        this.refreshData(this._reqParam);
        break;
      case 1 : 
        utils.setSessionStorage('supplierAuditBusinessBasicInitTab','pass')
        this._currentTab = 1;
        this._reqParam.status = 2;
        this._reqParam.page.currentPage = 1;
        this._reqParam.page.pageSize = 10;
        this.refreshData(this._reqParam);
        break;
      case 2 : 
        utils.setSessionStorage('supplierAuditBusinessBasicInitTab','failure')
        this._currentTab = 2;
        this._reqParam.status = 3;
        this._reqParam.page.currentPage = 1;
        this._reqParam.page.pageSize = 10;
        this.refreshData(this._reqParam);
        break;
    }
  }

  //条件搜索
  search(){
    this._reqParam.page.currentPage = 1;
    this.refreshData(this._reqParam);
  }

  // 清除
  clear(){
    this._reqParam = {
      "status": this._reqParam.status, //审核状态（1：待审核   2：通过   3：未通过）
      "createTimeEnd": "", //时间格式 搜索提交时间-结束时间
      "createTimeStart": "", //时间格式 搜索提交时间-开始时间
      "verifyTimeEnd": "", //时间格式 搜索审核时间-结束时间
      "verifyTimeStart": "", //时间格式 搜索审核时间-开始时间
      "storesName": "", //搜索店铺名称
      "serviceName": "", //搜索供应商名称
      page: utils.pageParams(),
    };
    this._createTimeStartDate = null;
    this._createTimeEndDate = null;
    this._verifyTimeStartDate = null
    this._verifyTimeEndDate = null
  }

  _startValueChange(){
    
  }

  _endValueChange(){
    
  };
  _disabledCreateTimeStartDate = (startValue) => {
    if (!startValue || !this._createTimeEndDate) {
      return startValue && startValue.getTime() > Date.now();
    }
    return (startValue.getTime() >= this._createTimeEndDate.getTime());
  };
  _disabledCreateTimeEndDate = (endValue) => {
    if (!endValue || !this._createTimeStartDate) {
      return endValue && endValue.getTime() > Date.now();
    }
    return (endValue.getTime() <= this._createTimeStartDate.getTime()) || (endValue && endValue.getTime() > Date.now());
  };

  _disabledVerifyTimeStartDate = (startValue) => {
    if (!startValue || !this._verifyTimeEndDate) {
      return startValue && startValue.getTime() > Date.now();
    }
    return (startValue.getTime() >= this._verifyTimeEndDate.getTime());
  };
  _disabledVerifyTimeEndDate = (endValue) => {
    if (!endValue || !this._verifyTimeStartDate) {
      return endValue && endValue.getTime() > Date.now();
    }
    return (endValue.getTime() <= this._verifyTimeStartDate.getTime()) || (endValue && endValue.getTime() > Date.now());
  };


  goPage(item){
    this.router.navigate(['/supplierManage/supplierAuditBusiness/supplierAuditBusinessDetail',item.id,item.storeId],{queryParams: {status: this._reqParam.status,createTime: item.createTime}})
  }

}
