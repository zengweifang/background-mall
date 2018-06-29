import { Component, OnInit } from '@angular/core';
import { NzMessageService,NzNotificationService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { SupplierManageService } from '../../supplier-manage.service';
import { CustomModalService } from '../../../../shared/services/custom-modal.service';
import { FormBuilder, FormGroup } from "@angular/forms";
@Component({
  selector: 'app-supplier-check-operate',
  templateUrl: './supplier-check-operate.component.html',
  styleUrls: ['./supplier-check-operate.component.scss']
})
export class SupplierCheckOperateComponent implements OnInit {
  _id: string = ''
  _checkBtnLoad: boolean = false
  _currentTab: number = 1
  _status: string = ''
  _loading: boolean = false
  _deleteBtnLoading: boolean = false
  _supplierCheckOperateForm: FormGroup
  _dataSet = []
  _total: number
  _goodsTypeNo1List
  _goodsTypeNo2List
  _goodsTypeNo3List
  _adcode = []
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

  _reqParam = {
    providerId: '',
    firstTypeId: '',
    secondTypeId: '',
    thirdTypeId: '',
    page:utils.pageParams()
  }

  _allChecked = false;
  _disabledButton = false;
  _checkedNumber = 0;
  _indeterminate = false;

  constructor(private message: NzMessageService,private customModalService: CustomModalService,private supplierManageService: SupplierManageService,private router:Router,private activatedRoute:ActivatedRoute,private notificationService: NzNotificationService,private fb: FormBuilder) {
    this._id = this.activatedRoute.snapshot.paramMap.get('id');
    this._status = this.activatedRoute.snapshot.queryParamMap.get('status');
    this._reqParam.providerId = this._id;
  }

  ngOnInit() {
    this._supplierCheckOperateForm = this.fb.group({
      goodsType: ['']
    });
    this.getGoodsTypeInfo();
  }

  //获取品类
  getAllGoodsType(param){
    return new Promise((resolve,reject) => {
      this.supplierManageService.getAllGoodsType(this._id,param).then(res => {
        if(utils.getStatusCode(res.code) == config.successCode){
          res.data ? resolve(res.data): reject('err')
        }else{
          this.message.create('error', res.message);
          reject('err')
        }
      }).catch(err => {
        console.log(err);
        this.message.create('error', '网络加载失败');
        reject(err)
        
      })
    })
  }

  getGoodsTypeInfo(){
    this._loading = true;
    this.supplierManageService.getGoodsTypeInfo(this._reqParam).then( res => {
      this._loading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        if(res.data){
          this._dataSet = res.data.serviceProviderGoodsTypeResults ? res.data.serviceProviderGoodsTypeResults : [];
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

  search(){
    let goodsTypeValue = this._supplierCheckOperateForm.get('goodsType').value;
    this._reqParam.firstTypeId = goodsTypeValue[0];
    this._reqParam.secondTypeId = goodsTypeValue[1];
    this._reqParam.thirdTypeId = goodsTypeValue[2];
    this.getGoodsTypeInfo();
  }

  delete(item){
    let Ids = [];
    this._dataSet.forEach(element => {
        element.checked && Ids.push(element.thirdTypeId);
    });

    let _self = this;
    this.customModalService._confirm({
      title: '注意！！！！！',
      content: '清除品类后，该品类下的商品将永久失效，无法再次上架！再次确认是否删除？',
      onOk() {
        _self._deleteBtnLoading = true;
        let reqParam = {
          providerId: _self._id,
          goodsTypeIds: Ids
        }
        _self.supplierManageService.delete(reqParam).then(res => {
          _self._deleteBtnLoading = false;
          if(utils.getStatusCode(res.code) == config.successCode){
            _self.notificationService.create('success',res.message,'');
            _self.getGoodsTypeInfo();
          }else{
            _self.message.create('error', res.message);
          }
        }).catch(err => {
          _self._deleteBtnLoading = false;
          _self.message.create('error', '网络加载失败');
        })
      },
      onCancel() {
      }
    });
  }
  
  tabClick(tab){
    switch(tab.index) {
      case 0: 
        this.router.navigate(['/supplierManage/supplierCheck/checkSupplierBasic',this._id]);
        break;
      case 2: 
        this.router.navigate(['/supplierManage/supplierList/supplierList']);
        break;
    }
  }

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


  /** load data async */
  loadData(e: {option: any, index: number, resolve: Function, reject: Function}): void {
    if (e.index === -1) {
      this.getAllGoodsType(0).then(res => {
        console.log(res);
        this._goodsTypeNo1List = res;
        e.resolve(this._goodsTypeNo1List);
      }).catch(err => {
        console.log(err)
        this._goodsTypeNo1List = [];
      })
      return;
    }
    const option = e.option;
    option.loading = true;
    if (e.index === 0) {
      console.log(option)
      this.getAllGoodsType(option.goodsTypeId).then(res => {
        option.loading = false;
        this._goodsTypeNo2List = res
        e.resolve(this._goodsTypeNo2List);
      }).catch(err => {
        console.log(err)
        option.loading = false;
        this._goodsTypeNo2List = [];
      })
    }
    if (e.index === 1) {
      this.getAllGoodsType(option.goodsTypeId).then(res => {
        option.loading = false;
        this._goodsTypeNo3List = res;
        e.resolve(this._goodsTypeNo3List);
      }).catch(err => {
        console.log(err)
        option.loading = false;
        this._goodsTypeNo3List = [];
      })
    }

    if (e.index === 2) {
      option.loading = false;
    }
  }

  goAdd(){
    this.router.navigate(['/supplierManage/supplierAdd/addSupplierOperate',this._id],{queryParams: {from: 'check',status: this._status}})
  }

  goBack(){
    this.router.navigate(['/supplierManage/supplierList/supplierList'])
  }

}
