import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { SupplierManageService } from '../../supplier-manage.service';
import { CustomModalService } from '../../../../shared/services/custom-modal.service';
import { Store } from "@ngrx/store";
import { LOADINGOPEN, LOADINGCLOSE } from "../../../../shared/reducer/page-load";
@Component({
  selector: 'app-supplier-check-basic',
  templateUrl: './supplier-check-basic.component.html',
  styleUrls: ['./supplier-check-basic.component.scss']
})
export class SupplierCheckBasicComponent implements OnInit {
  _id: string = ''
  _checkBtnLoad: boolean = false
  _currentTab: number = 0
  _baseInfo = {
    username: '',
    serviceName: '',
    serviceTypes: [{name: '123'}],
    isOwn: false,
    name: '',
    tel: '',
    phone: '',
    idCard: '',
    qq: '',
    email: '',
    receiverPhone: '',
    address: '',
    postalCode: '',
    province: '',
    city: '',
    district: '',
    createTime: 0,
    businessLicenseImgs: [],
    logoImg: '',
    provinceName: '',
    cityName: '',
    districtName: '',
    status: 1
  }
  _tabs = [
    {
      index: 0,
      tabName: '基本信息'
    },
    {
      index: 1,
      tabName: '经营品类范围'
    },
    {
      index: 2,
      tabName: '结算佣金'
    }
  ];
  constructor(private message: NzMessageService,private customModalService: CustomModalService,private supplierManageService: SupplierManageService,private router:Router,private activatedRoute:ActivatedRoute,private store: Store<AppState>) {
    this._id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getProvider();
  }


  getProvider(){
    this.store.dispatch({type: LOADINGOPEN});
    this.supplierManageService.getProviderById(this._id).then(res => {
      this.store.dispatch({type: LOADINGCLOSE});
      if(utils.getStatusCode(res.code) == config.successCode){
        console.log(res);
        if(res.data){
          this._baseInfo = res.data;
        }
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      console.log(err)
      this.store.dispatch({type: LOADINGCLOSE});
      this.message.create('error', '网络加载失败');
    })
  }

  //封停/解封
  toHandByStatus(status){
    //status 0代表封停，1代表解封
    console.log(status)
    let contentText = '',
        _self = this;
    switch(status){
      case 0:
        contentText = '封停后供应商的所有商品和店铺将下架，是否确认操作？';
        break;
      case 1: 
        contentText = '是否确定解封操作？';
        break;
    }
    this.customModalService._confirm({
      title:'温馨提示',
      content: contentText,
      okText: '确定',
      cancelText: '取消',
      onOk(){
        _self._checkBtnLoad = true;
        _self.supplierManageService.toHandByStatus(_self._id,status).then(res => {
          _self._checkBtnLoad = false;
          console.log(res);
          if(utils.getStatusCode(res.code) == config.successCode){
            _self.message.create('success', '操作成功');
            _self._baseInfo.status = status;
          }else{
            this.message.create('error', res.message);
          }
        }).catch(err => {
          console.log(err);
          _self._checkBtnLoad = false;
          _self.message.create('error', '网络连接失败');
        })
      },
      onCancel(){
        
      },

    });
  }

  tabClick(tab){
    switch(tab.index) {
      case 1: 
        this.router.navigate(['/supplierManage/supplierCheck/checkSupplierOperate',this._id], {queryParams: {status : this._baseInfo.status}});
        break;
      case 2: 
        this.router.navigate(['/supplierManage/supplierList/supplierList']);
        break;
    }
  }

  goEdit(){
    this.router.navigate(['/supplierManage/supplierEdit/editSupplierBasic',this._id],{queryParams: {from : 'check'}})
  }

  goBack(){
    this.router.navigate(['/supplierManage/supplierList/supplierList'])
  }

}
