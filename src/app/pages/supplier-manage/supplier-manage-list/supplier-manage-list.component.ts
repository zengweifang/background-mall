import { Component, OnInit,AfterContentInit,AfterViewInit } from '@angular/core';
import { NzMessageService} from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { utils } from '../../../shared/utils/utils';
import { config, service } from '../../../core/core.config';
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { SupplierManageService } from '../supplier-manage.service';
@Component({
  selector: 'app-supplier-manage-list',
  templateUrl: './supplier-manage-list.component.html',
  styleUrls: ['./supplier-manage-list.component.scss']
})
export class SupplierManageListComponent implements OnInit,AfterViewInit {
  _total = 0
  _startDate = null
  _endDate = null
  _supplierManagerListForm: FormGroup
  _loading = false
  _dataSet = []
  _statusAll = [{ 'id': '', 'name': '全部' }, { 'id': 0, 'name': '已封停' }, { 'id': 1, 'name': '正常' }]
  _findType = []
  _reqParam = {
    "serviceName": "",
    "phone": "",
    "username": "",         //参考表结构
    "createTimeStart": "",    //参考表结构
    "createTimeEnd": "",      //参考表结构   暂时不全
    "status": "",     //暂未定义				
    "serviceType": null,
    orderBy: '-create_time',
    page:utils.pageParams()
  }
  constructor(private fb: FormBuilder,private message: NzMessageService,private supplierManageService: SupplierManageService,private router:Router) { }

  ngOnInit() {
    this._supplierManagerListForm = this.fb.group({
      serviceName: ['',],
      phone: ['',],
      username: ['',],
      startDate: ['',],
      endDate: ['',],
      status: ['',],
      serviceType: ['',]
    });
    this.getData();
    this.refreshData();
  }

  ngAfterViewInit(){
    
  }

  // 获取供应商类型
  getData(){
    this.supplierManageService.supplierFindAll().then(res => {
      if(utils.getStatusCode(res.code) == config.successCode){
        
        this._findType = res.data ? res.data : [];
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this.message.create('error', '网络加载失败');
    })
  }


  refreshData(){
    this._loading = true;
    this._reqParam.createTimeStart = this._startDate;
    this._reqParam.createTimeEnd = this._endDate;
    this.supplierManageService.supplierGetList(this._reqParam).then( res => {
      this._loading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        if(res.data){
          this._dataSet = res.data.serviceProviderListDtos ? res.data.serviceProviderListDtos : [];
          this._total = res.data.page.totalCount;
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

  search(){
    this._reqParam.page.currentPage = 1;
    this.refreshData();
  }

  clear(){
    this._reqParam = {
      "serviceName": "",
      "phone": "",
      "username": "",         //参考表结构
      "createTimeStart": "",    //参考表结构
      "createTimeEnd": "",      //参考表结构   暂时不全
      "status": "",     //暂未定义				
      "serviceType": null,
      orderBy: '-create_time',
      page:utils.pageParams()
    },
    this._startDate = null;
    this._endDate = null;
  }

  _startValueChange(){
    
  }

  _endValueChange(){
    
  }
  
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


  goAdd(){
    this.router.navigate(['/supplierManage/supplierAdd/addSupplierBasic'])
  }

  editBasic(item){
    this.router.navigate(['/supplierManage/supplierEdit/editSupplierBasic',item.id],{queryParams: {from : 'list'}})
  }

  editOperate(item){
    this.router.navigate(['/supplierManage/supplierAdd/addSupplierOperate',item.id],{queryParams: {from: 'list'}})
  }

  goCheck(item){
    this.router.navigate(['/supplierManage/supplierCheck/checkSupplierBasic',item.id])
  }

}
