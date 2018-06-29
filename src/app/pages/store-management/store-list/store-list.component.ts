import { Component, OnInit } from '@angular/core';
import { NzMessageService} from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { utils } from '../../../shared/utils/utils';
import { config, service } from '../../../core/core.config';
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { StoreListService } from './store-list.service';
import { StoreManagementService } from '../store-management.service';
import { CustomModalService } from '../../../shared/services/custom-modal.service';
import { StoreListModalComponent } from './store-list-modal/store-list-modal.component';
@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss']
})
export class StoreListComponent implements OnInit {

  _storeManagerListForm: FormGroup
  _providerId: string = utils.getSessionStorage('userId');
  _reqParam = {
    name: '',
    status: '',
    providerid: this._providerId,
    page: utils.pageParams()
  }

  //初始化状态
  _allStatus= [{id:0,name:'已关闭'},{id:1,name:'营业中'},{id:'',name:'全部'}];

  _total:number = 0
  _loading:boolean = false
  _dataSet = []
  // 是否显示服务设置
  _showStoreServiceInventoryRules: boolean;
  constructor(private fb: FormBuilder,private message: NzMessageService,private router:Router,private storeListService: StoreListService,private storeManagementService: StoreManagementService,private customModalService: CustomModalService) {

  }

  ngOnInit() {
    this._storeManagerListForm = this.fb.group({
      name: ['',],
      status: ['',]
    });

    this.refreshData();
  }

  refreshData(){
    this._loading = true;
    this.storeListService.getStoreList(this._reqParam).then( res => {
      this._loading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        if(res.data){
          this._dataSet = res.data.stores ? res.data.stores : [];
          this._total = res.data.page.totalCount;
          if(res.data.showStoreServiceInventoryRules){
            this._showStoreServiceInventoryRules = true;
          }
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


  clear(){
    this._reqParam.name = '',
    this._reqParam.status = '',
    this._reqParam.page.currentPage = 1;
    this.refreshData();
  }

  search(){
    this._reqParam.page.currentPage = 1;
    this.refreshData();
  }

  editService(item){
    let _self = this;
    this.customModalService._content({
      title:'服务设置',
      content: StoreListModalComponent,
      width: 780,
      componentParams: {
        data: item,
        from: 'storeList',
        isVirtual: item.isVirtual
      },
      onOk (){
        _self.refreshData();
      }
    });
  }

  goAdd(){
    this.router.navigate(['/storeManagement/storeAdd/storeAddBasic'])
  }

  goStroeManagement(item){
    // 虚拟店铺or真实店铺
    if(item.isVirtual){
      this.storeManagementService.storeServiceInventoryIsVirtual = true;
    }else{
      this.storeManagementService.storeServiceInventoryIsVirtual = false;
    }
    if(this._showStoreServiceInventoryRules){
      this.storeManagementService.showStoreServiceInventory = true;
      if(!item.storeServiceInventoryRules && item.canSetStoreServiceInventoryRules == 0){
        this.storeManagementService.storeServiceInventoryDisable = true;
      }else{
        this.storeManagementService.storeServiceInventoryDisable = false;
      }
    }else{
      this.storeManagementService.showStoreServiceInventory = false;
    }
    this.router.navigate(['/supplierManage/supplierAdd/storeCheckSales',item.id])
  }

}
