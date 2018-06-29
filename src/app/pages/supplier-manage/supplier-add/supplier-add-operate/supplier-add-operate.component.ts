import { Component, OnInit,ViewChild} from '@angular/core';
import { NzTreeComponent} from 'ng-tree-antd';
import { Router,ActivatedRoute } from '@angular/router';
import { SupplierManageService } from '../../supplier-manage.service';
import { NzMessageService} from 'ng-zorro-antd';
import { CustomModalService } from '../../../../shared/services/custom-modal.service';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { Observable } from 'rxjs/Observable';
import { Store } from "@ngrx/store";
import { LOADINGOPEN, LOADINGCLOSE } from "../../../../shared/reducer/page-load";

@Component({
  selector: 'app-supplier-add-operate',
  templateUrl: './supplier-add-operate.component.html',
  styleUrls: ['./supplier-add-operate.component.scss']
})
export class SupplierAddOperateComponent implements OnInit {
  _current:number = 1;
  _id: string = ''
  _from: string = ''
  _status: string = ''
  _data: any = {
    serviceName: '',
    username: '',
    serviceTypes: [1],
    phone: '',
    createTime: null,
    status: 0
  }
  _baseParams = {
    serviceProviderId: '',
    goodsTypeIds:[]
  }
  _options = {
    childrenField: 'items'
  }
  _searchKeywords: string = ''
  _nodes = []
  _stopType: string = ''  //正常还是封停状态 0:封停，1：正常
  _canDeactivate: boolean = false;
  constructor(private supplierManageService: SupplierManageService,private message: NzMessageService,private customModalService:CustomModalService,private router: Router,private activatedRoute:ActivatedRoute,private store: Store<AppState>) {
    this._id = this.activatedRoute.snapshot.paramMap.get('id');
    this._from = this.activatedRoute.snapshot.queryParamMap.get('from');
    this._status = this.activatedRoute.snapshot.queryParamMap.get('_status');
    this._baseParams.serviceProviderId = this._id;
  }

  @ViewChild(NzTreeComponent) tree: NzTreeComponent;
  filterNodes() {
    this.tree.treeModel.filterNodes(this._searchKeywords);
    if (!this._searchKeywords) this.tree.treeModel.collapseAll();
  }
  
  ngOnInit() {
    
    this.getProvider();
   
    this.getGoodsType();
   
  }


  getGoodsType(){
    this.store.dispatch({type: LOADINGOPEN});
    this.supplierManageService.getGoodsTypeById(this._id).then(res => {
      this.store.dispatch({type: LOADINGCLOSE});
      if(utils.getStatusCode(res.code) == config.successCode){
        if(res.data){
          this._nodes = res.data;
          this.addDisableCheckboxKeyForNode(this._nodes);
        }else{
          this._nodes = [];
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

  getProvider(){
    this.supplierManageService.getProviderById(this._id).then(res => {
      if(utils.getStatusCode(res.code) == config.successCode){
        if(res.data){
          this._data = res.data;
          this._stopType = res.data.status;
        }
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      console.log(err)
      this.message.create('error', '网络加载失败');
    })
  }

  save(){
    this._baseParams.goodsTypeIds = [];
    this.addNodeIdInBaseParams(this._nodes);
    this.supplierManageService.saveGoodsType(this._baseParams).then(res => {
      if(utils.getStatusCode(res.code) == config.successCode){
        if(this._from === 'add'){
          let _self = this;
          this.customModalService._confirm({
            title:'保存成功！',
            content: '是否马上设置佣金',
            okText: '现在设置',
            cancelText: '以后再说',
            onOk(){

              utils.setSessionStorage('providerInfo',_self._data);
              _self._canDeactivate = true;
              _self.router.navigate(['/supplierManage/supplierAdd/addSupplierFinance',_self._id],{queryParams: {status: 1}})
            },
            onCancel(){
              _self._canDeactivate = true;
              _self.router.navigate(['/supplierManage/supplierList/supplierList'])
            },
  
          });
        }else if(this._from === 'list'){
          this.message.create('success', "保存成功");
          this._canDeactivate = true;
          this.router.navigate(['/supplierManage/supplierList/supplierList'])
        }else{
          this.message.create('success', "保存成功");
          this._canDeactivate = true;
          this.router.navigate(['/supplierManage/supplierCheck/checkSupplierOperate',this._id], {queryParams: {status : this._status}});
        }
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      console.log(err)
      this.message.create('error', '网络加载失败');
    })
  }

  
  addDisableCheckboxKeyForNode(param){
    for(let item of param){
      item.disableCheckbox = item.disabled;
      if(item.items.length > 0){
        this.addDisableCheckboxKeyForNode(item.items)
      }
    }
  }

  addNodeIdInBaseParams(param){
    for(let item of param){
      if(item.checked){
        this._baseParams.goodsTypeIds.push(item.id);
      }
      if(item.items.length > 0){
        this.addNodeIdInBaseParams(item.items);
      }
    }
  }

  isCheckItemInNodes(param){
    for(let item of param){
      if(!item.disabled && item.checked){
        return false;
      }
      if(item.items.length > 0){
        this.isCheckItemInNodes(item.items);
      }
    }

    return true;
  }
  
  // 处理未保存的更改  路由守卫
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    // observable  貌似不行  Promise<boolean> | boolean 可以

    if (this._canDeactivate || this.isCheckItemInNodes(this._nodes)){
        return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    
    return new Promise(resolve => {
      this.customModalService._confirm({
        title:'温馨提示',
        content: '如果确认返回，刚勾选的品类不会被保存',
        okText: '确认',
        cancelText: '取消',
        onOk(){
          resolve(true)
        },
        onCancel(){
          resolve(false)
        },

      });
    })
  }

  goBack(){
    if(this._from === 'check'){
      this.router.navigate(['/supplierManage/supplierCheck/checkSupplierOperate',this._id], {queryParams: {status : this._status}});
    }else{
      this.router.navigate(['/supplierManage/supplierList/supplierList'])
    }
    
  }
}
