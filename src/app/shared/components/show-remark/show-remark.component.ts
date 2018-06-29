import { Component, OnInit, Input } from '@angular/core';
import { NzPopoverModule } from 'ng-zorro-antd';
import { utils } from '../../utils/utils';
import { config, service } from '../../../core/core.config';
import { AjaxService } from '../../services/ajax.service';
import { NzMessageService} from 'ng-zorro-antd';
@Component({
  selector: 'app-show-remark',
  templateUrl: './show-remark.component.html',
  styleUrls: ['./show-remark.component.scss']
})
export class ShowRemarkComponent implements OnInit {

  @Input() data;

  addCustomerServiceRemarkUrl = `${service.commonService}/background-manage/managerorder/addCustomerServiceRemark`;
  
  textareaValue: string
  list: any[]
  checkboxSelect = [];
  _isVisible: boolean;
  _isSpinning = false;

  constructor(private ajaxService:AjaxService,private message: NzMessageService) {

  }
  
  ngOnInit() {
    this.textareaValue = this.data.customerServiceRemark.content;
    this.list = utils.deepCopy(this.data.customerServiceRemark.tagList);
  }
  

  checkboxChange(item){
    if(item.selected){
      this.checkboxSelect.push(item);
    }else{
      if(this.checkboxSelect.includes(item)){
        let index = this.checkboxSelect.indexOf(item);
        this.checkboxSelect.splice(index,1)
        
      }
    }
  }

  cancel(){
    this._isVisible = false;
  }
  visibleChange(value){
    if(value){
      this._isVisible = true;
      this._isSpinning = false;
    }
  }
  sure(){
    this._isSpinning = true;
    let arr = [];
    this.list.forEach((item,index) => {
      if(item.selected){
        arr.push(item.type)
      }
    });
    let reqParam = {
      orderId: this.data.mainKeyId,
      operater: utils.getSessionStorage('userId'),
      content: this.textareaValue,
      tagTypes: arr
    }

    this.ajaxService.post(this.addCustomerServiceRemarkUrl,reqParam).then(res => {
      this._isSpinning = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        for(let itemOut of this.data.customerServiceRemark.tagList){
          for(let itemInner of this.list){
            if(itemOut.type == itemInner.type){
              itemOut.selected = itemInner.selected;
            }
          }
        }
        this.data.customerServiceRemark.content = this.textareaValue;
        this.message.create('success', '操作成功！');
        this._isVisible = false;
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this._isSpinning = false;
      this.message.create('error', '网络连接失败');
    })
  }
}
