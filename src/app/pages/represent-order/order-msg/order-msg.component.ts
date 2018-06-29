import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import { Router,ActivatedRoute } from '@angular/router';
import { utils } from '../../../shared/utils/utils';
import { config, service } from '../../../core/core.config';
import { FormBuilder, FormGroup, FormControl,Validators } from "@angular/forms";
import { OrderMsgService } from './order-msg.service';
import { ValidatorService } from "../../../core/validator.service";
import { Store } from "@ngrx/store";
import { LOADINGOPEN, LOADINGCLOSE } from "../../../shared/reducer/page-load";
import { CustomModalService } from '../../../shared/services/custom-modal.service';
import { AddAndEditModalComponent } from './add-and-edit-modal/add-and-edit-modal.component';
@Component({
  selector: 'app-order-msg',
  templateUrl: './order-msg.component.html',
  styleUrls: ['./order-msg.component.scss']
})
export class OrderMsgComponent implements OnInit {
  _orderMsgForm: FormGroup
  _reqParam = {
    orderSource: {
      appid: '',
      id: '',
      name: ''
    },
    outTradeNo: '',
    phone: ''
  }

  _addrListObj = []
  _selectedItem
  _showServiceList: boolean = false;
  _loading: boolean = false;
  _from: string = ''
  // 需要缓存的数据
  _storageObj = {
    appId: '',
    channelId: '',
    channelName: '',
    name: '',
    userId: '',
    phone: '',
    pname: '',
    cityname: '',
    adname: '',
    address: '',
    addressId: '',
    adcode: '',
    poiName: '',
    administrateRegionId: '',
    baseInfoPhone: '',
    outTradeNo: '',
    location: ''
  }

  _defaultSearchOptions = [];
  _newOption;

  constructor(private fb: FormBuilder,private message: NzMessageService,private router:Router,private orderMsgService: OrderMsgService,private validatorService: ValidatorService,private store: Store<AppState>,private customModalService: CustomModalService,private notificationService: NzNotificationService,private activatedRoute:ActivatedRoute) {
    this._from = this.activatedRoute.snapshot.queryParamMap.get('from');
  }

  ngOnInit() {
    this._orderMsgForm = this.fb.group({
      orderSource: [null,Validators.required],
      outTradeNo: ['',],
      phone: ['',this.validatorService.phoneValidator]
    });
    this.getChannelList();
    utils.removceSessionStorage('storageObj');
    utils.removceSessionStorage('processInstanceId');
  }

  getChannelList(){
    this.orderMsgService.getChannelList().then(res => {
      if(utils.getStatusCode(res.code) == config.successCode){
        this._defaultSearchOptions = res.data ? res.data : [];
        if(this._from === 'goodsList'){
          let roObj = utils.getSessionStorage('roObj');
          for(let item of this._defaultSearchOptions){
            if(item.appid == roObj.appId){
              this._reqParam.orderSource = item;
            }
          }
          this._reqParam.phone = roObj.baseInfoPhone;
          this._reqParam.outTradeNo = roObj.outTradeNo;
          this.creatUser();
        }else{
          utils.removceSessionStorage('roObj');
        }
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this.message.create('error', '网络加载失败');
    })
  }

  //用户登录、创建
  creatUser(){
    this.setChannel();
    let param = {
      "phone": this._reqParam.phone,
      "appId": this._storageObj.appId,
      "clientId": config.clientId,
      "clientSecret": config.clientSecret
    }
    this.orderMsgService.creatUserService(param).then(res => {
      if(utils.getStatusCode(res.code) == config.successCode){
        this._showServiceList = true;
        this.getAddrList(res.data.phone)
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this.message.create('error', '网络加载失败');
    })
  }

  getAddrList(param){
    this._selectedItem = null;
    this._loading = true;
    this.orderMsgService.getAddrList(param).then(res => {
      this._loading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        this._addrListObj = res.data ? res.data : [];
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this._loading = false;
      this.message.create('error', '网络加载失败');
    })
  }

  addAddress(){
    let _self = this;
    this.customModalService._content({
      title:'新增地址',
      content: AddAndEditModalComponent,
      width: 600,
      componentParams: {
        phone: this._reqParam.phone,
        basePhone: this._reqParam.phone
      },
      onOk(){
        _self.getAddrList(_self._reqParam.phone);
      }
    });
  }

  editAddress(item){
    let _self = this;
    this.customModalService._content({
      title:'编辑地址',
      content: AddAndEditModalComponent,
      width: 600,
      componentParams: {
        data: item,
        basePhone: this._reqParam.phone
      },
      onOk(){
        _self.getAddrList(_self._reqParam.phone);
      }
    });
  }

  deleteAddress(param){
    let _self = this;
    this.customModalService._confirm({
      title:'提示',
      content: '您确定要删除这个服务地址吗？',
      onOk(){
        _self.orderMsgService.deleteAddrService(param).then(res => {
          if(utils.getStatusCode(res.code) == config.successCode){
            _self.notificationService.create('success',res.message,'');
            _self.getAddrList(_self._reqParam.phone);
          }else{
            _self.notificationService.create('error',res.message,'');
          }
        }).catch(err => {
          _self.notificationService.create('error','网络加载失败','');
        })
      },
      
    });
  }

  

  // 功能类方法

  get searchOptions() {
    if (this._newOption) {
      return [this._newOption, ...this._defaultSearchOptions]
    } else {
      return this._defaultSearchOptions;
    }
  }


  searchChange($event) {
    if (!$event) {
      this._newOption = null;
      return
    }
    if ($event && this._defaultSearchOptions.findIndex(e => e.value === $event) === -1) {
      this._newOption = { value: $event, name: $event }
    }
  }

  modelChange() {
    if (this._newOption && this._newOption.value) {
      this._newOption = null;
    }
  }
  

  getFormControl(name){
      return this._orderMsgForm.controls[name];
  }

  setChannel(){
    this._storageObj.appId = this._reqParam.orderSource.appid;
    this._storageObj.channelId = this._reqParam.orderSource.id;
    this._storageObj.channelName = this._reqParam.orderSource.name;
  }

  goGoosList(){
    this._storageObj.name = this._selectedItem.name;
    this._storageObj.userId = this._selectedItem.userId;
    this._storageObj.phone = this._selectedItem.phone;
    this._storageObj.pname = this._selectedItem.pname;
    this._storageObj.cityname = this._selectedItem.cityname;
    this._storageObj.adname = this._selectedItem.adname;
    this._storageObj.address = this._selectedItem.address;
    this._storageObj.addressId = this._selectedItem.id;
    this._storageObj.adcode = this._selectedItem.adcode;
    this._storageObj.poiName = this._selectedItem.poiName;
    this._storageObj.administrateRegionId = this._selectedItem.administrateRegionId;
    this._storageObj.baseInfoPhone = this._reqParam.phone;
    this._storageObj.location = this._selectedItem.location;
    this._storageObj.outTradeNo = this._reqParam.outTradeNo;
    utils.setSessionStorage('roObj',this._storageObj);
    this.router.navigate(['/representingOrder/goodsList'])
  }

}
