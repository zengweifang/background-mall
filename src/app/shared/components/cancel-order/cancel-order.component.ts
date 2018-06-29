import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { NzPopoverModule } from 'ng-zorro-antd';
import { utils } from '../../utils/utils';
import { config, service } from '../../../core/core.config';
import { AjaxService } from '../../services/ajax.service';
import { NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.scss']
})
export class CancelOrderComponent implements OnInit {
  
  _cancelReasons:any[] = [];
  _cancelOrderReasons:any[] = []
  _data: any
  _radioValue: string = ''
  _isVisible: boolean = false;
  _isSpinning: boolean = false;
  _title: string = ''
  @Input()
  set data(value){
    this._data = value
  }
  @Input() cancelOrderReasons;

  @Output() cancelReceiveOrderSuccess = new EventEmitter<boolean>();
  
  constructor(private ajaxService:AjaxService,private message: NzMessageService) { }

  ngOnInit() {
    
  }
  // $scope.cancelReasons = [{id:1,reason:'取消订单，不派单'},{id:2,reason:'取消订单，重新派单'},
  // 	{id:3,reason:'取消订单，虚拟订单设为完成，取消关联的真实订单(点评)'},{id:4,reason:'取消虚拟订单(非点评)'},{id:5,reason:'取消真实订单'}];

  // 获取取消原因
  _getData(){
    let getCancelReasonsUrl = `${service.commonService}/background-manage/managerorder/cancelSelection?orderId=${this._data.mainKeyId}`
    this.ajaxService.get(getCancelReasonsUrl).then(res => {
      if(utils.getStatusCode(res.code) == config.successCode){
        this._cancelReasons = res.data;
        this._cancelOrderReasons = this.cancelOrderReasons;
        if(this._cancelReasons.length > 0){
          this._title = "请选择取消类型"
        }else{
          this._title = "取消订单"
        }
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this.message.create('error', '网络连接失败');
    })
  }
  visibleChange(value){
    if(value){
      this._isVisible = true;
      this._isSpinning = false;
    }
  }

  sure(){
    if(this._cancelReasons.length > 0){
      this._isSpinning = true;
      let cancelReceiveOrderUrl = `${service.commonService}/background-manage/managerorder/cancelReceiveOrder?orderId=${this._data.mainKeyId}&opType=${this._radioValue}`;
      this.ajaxService.get(cancelReceiveOrderUrl).then(res => {
        this._isSpinning = false;
        if(utils.getStatusCode(res.code) == config.successCode){
          this.message.create('success', res.message);
          this.cancelReceiveOrderSuccess.emit(true);
        }else{
          this.message.create('error', res.message);
        }
      }).catch(err => {
        console.log(err)
        this._isSpinning = false;
        this.message.create('error', '网络连接失败');
      })
    }else{
      this._isSpinning = true;
      let cancelReceiveOrderUrl = `${service.commonService}/background-manage/managerorder/cancelReceiveOrder?orderId=${this._data.mainKeyId}&opType=5&reasonId=${this._data.reasonId}&desc=${this._data.desc}`;
      this.ajaxService.get(cancelReceiveOrderUrl).then(res => {
        this._isSpinning = false;
        if(utils.getStatusCode(res.code) == config.successCode){
          this._isVisible = false;
          this.message.create('success', res.message);
          this.cancelReceiveOrderSuccess.emit(true);
        }else{
          this.message.create('error', res.message);
        }
      }).catch(err => {
        console.log(err)
        this._isSpinning = false;
        this.message.create('error', '网络连接失败');
      })
    }
  }

  cancel(){
    this._isVisible = false;
  }
  

}
