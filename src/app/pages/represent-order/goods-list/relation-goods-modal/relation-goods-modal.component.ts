import { Component, OnInit, Input } from '@angular/core';
import { NzModalSubject,NzNotificationService, NzMessageService} from 'ng-zorro-antd';
import { GoodsListService } from '../goods-list.service';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { Router } from '@angular/router';
@Component({
  selector: 'app-relation-goods-modal',
  templateUrl: './relation-goods-modal.component.html',
  styleUrls: ['./relation-goods-modal.component.scss']
})
export class RelationGoodsModalComponent implements OnInit {
  _total:number = 0
  _loading: boolean = false
  _isConfirmLoading: boolean = false;
  _selectedItem
  _dataSet = []
  _reqParam = {
    userId: "",
    appId: "",
    townCode: "",
    location: "",
    serviceSubscriptionId: "",
    serviceSubscriptionSource: "",
    page:utils.pageParams()
  }
  _storageObj = [];
  @Input()
  set roObj(value){
    this._reqParam.userId = value.userId;
    this._reqParam.appId = value.appId;
    this._reqParam.townCode = value.administrateRegionId;
    this._reqParam.location = value.location;
    
  }
  @Input() 
  set item(value){
    this._reqParam.serviceSubscriptionId = value.id;
    this._reqParam.serviceSubscriptionSource = value.source;
  }

  @Input() switchValue
  
  constructor(private goodsListService: GoodsListService,private subject: NzModalSubject,private notificationService: NzNotificationService,private message: NzMessageService,private router:Router) { }

  ngOnInit() {
    this.getServiceSubscriptionUserItemList();
  }


  getServiceSubscriptionUserItemList(){
    this._loading = true;
    this.goodsListService.getServiceSubscriptionUserItemList(this._reqParam).then(res => {
      this._loading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        if(res.data){
          this._dataSet = res.data.itemList ? res.data.itemList : [];
          this._total = res.data.page.totalCount;
          for(let item of this._dataSet){
            if(item.number){
              item.disabled = false;
            }else{
              item.disabled = true;
            }
          }
        }else{
          this._dataSet = []
        }
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this._loading = false;
      this.message.create('error', '网络加载失败');
    })
  }


  emitDataOutside(){
    if(!this._selectedItem.store){
      this.notificationService.create('error',this._selectedItem.purchaseTips,'');
    }

    this._storageObj = [];
    this._storageObj.push({
      'storeId': this._selectedItem.store.id,
      'goodsId': this._selectedItem.goodsId,
      'count': this._selectedItem.orderQuantity,
      'name': this._selectedItem.goodsName,
      'serviceSubscriptionId': this._reqParam.serviceSubscriptionId,
      'serviceSubscriptionSource': this._reqParam.serviceSubscriptionSource
    })

    utils.setSessionStorage('storageObj',this._storageObj);
    this.router.navigate(['/representingOrder/creatOrder'], {queryParams: {isCheck: this.switchValue}});
    this.subject.destroy('onOk');
  }

  handleCancel(e){
      this.subject.destroy('onCancel');
  }

}
