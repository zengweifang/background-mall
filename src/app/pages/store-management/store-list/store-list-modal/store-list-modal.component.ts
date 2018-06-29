import { Component, OnInit, Input } from '@angular/core';
import { NzModalSubject,NzNotificationService} from 'ng-zorro-antd';
import { FormBuilder, FormGroup, FormControl,Validators } from "@angular/forms";
import { StoreManagementService } from '../../store-management.service';
import { StoreListService } from '../store-list.service';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
@Component({
  selector: 'app-store-list-modal',
  templateUrl: './store-list-modal.component.html',
  styleUrls: ['./store-list-modal.component.scss']
})
export class StoreListModalComponent implements OnInit {
  _validateForm: FormGroup
  _startDate =  null;
  _endDate = null;
  _editParams = {
    advanceService: '',
    id: ''
  }
  _serviceTime = [];
  _metaData = [];
  _isConfirmLoading:boolean = false;


  @Input() data

  @Input() from

  @Input() isVirtual

  @Input() id

  constructor(private fb: FormBuilder,private subject: NzModalSubject,private notificationService: NzNotificationService,private storeManagementService: StoreManagementService,private storeListService: StoreListService) { }

  ngOnInit() {
    this._validateForm = this.fb.group({
      advanceService: ['',this.advanceServiceValidator],
    }); 
    if(this.from === 'storeList'){
      this.getTimeOfStoreList();
    }
  }

  getTimeOfStoreList(){
    this._editParams.advanceService = String(this.data.storeServiceInventoryRules.defaultProcessTime / 60); 
    this._editParams.id =  this.data.storeServiceInventoryRules.id; 
    if(this.data.storeServiceInventoryRules.times){
      for(let item of this.data.storeServiceInventoryRules.times){
        this._serviceTime.push({
          "timeStart": new Date(item.timeStart),
          "timeEnd": new Date(item.timeEnd)
        })
      }
    }
    
    
    if(this.data.storeServiceInventoryRules.processTimes){
      for(let item of this.data.storeServiceInventoryRules.processTimes){
        this._metaData.push({
          "timeStart" : new Date(item.timeStart),
          "timeEnd": new Date(item.timeEnd),
          "processTime": item.processTime / 60,
          "EndDisabled": false,
          "itemStartDisabledHours": () => {
            return []
          },
          "itemEndtDisabledHours": () => {
            return []
          },
          "itemStartDisabledMinutes": (h) => {
            let arr = this.newArray(0,60);
            arr.splice(0,1)
            arr.splice(29,1)
            return arr
          },
          "itemEndDisabledMinutes": (h) => {
            let arr = this.newArray(0,60);
            arr.splice(0,1)
            arr.splice(29,1)
            return arr
          }
        })
      }
    }
  }

  emitDataOutside(){
    console.log(123);
    for(let item of this._serviceTime){
      item.timeStart = new Date(item.timeStart.getFullYear() + "/" + (item.timeStart.getMonth() + 1) + "/" + item.timeStart.getDate() + " " +item.timeStart.getHours() + ":00:00")
      item.timeEnd = new Date(item.timeEnd.getFullYear() + "/" + (item.timeEnd.getMonth() + 1) + "/" + item.timeEnd.getDate() + " " +item.timeEnd.getHours() + ":00:00")
    }
    let processTimes = [];
    for(let item of this._metaData){
      if(item.timeStart && item.timeEnd && item.processTime >= 0){
        if(/^[0-9]{1,3}$/.test(item.processTime)){
          if(item.processTime <= 168){
            processTimes.push({
              "processTime": Number(item.processTime) * 60,
              "timeEnd": item.timeEnd,
              "timeStart": item.timeStart
            })
          }else{
            this.notificationService.create('error','暂不支持设置7天之后的时间','');
            return;
          }
        }else{
          this.notificationService.create('error','请输入的服务预约时间必须为整数','');
          return;
        }
      }else{
        this.notificationService.create('error','您有未填项，请补充','');
        return;
      } 
    }
    //调保存服务设置接口  根据不同页面做不同处理
    if(this.from === 'storeList'){
      if(this.data.canSetStoreServiceInventoryRules == 1 && !this.data.storeServiceInventoryRules){
        let json1 = {
          "storeId": this.data.id,
          "defaultProcessTime": Number(this._editParams.advanceService) * 60,
          "times": this._serviceTime,
          "processTimes": processTimes
        }
        this._isConfirmLoading = true;
        this.storeListService.addtoreervicenventoryrules(json1).then(res => {
          this._isConfirmLoading = false;
          if(utils.getStatusCode(res.code) == config.successCode){
            this.notificationService.create('success','服务设置成功','');
            this.subject.destroy('onOk');
          }else{
            this.notificationService.create('error',res.message,'');
          }
        }).catch(err => {
          console.log(err)
          this._isConfirmLoading = false;
          this.notificationService.create('error','网络连接失败','');
        })
      }else{
        let json = {
          "storeId": this.data.id,
          "id": this._editParams.id,
          "defaultProcessTime": Number(this._editParams.advanceService) * 60,
          "times": this._serviceTime,
          "isOpenServiceInventory": this.data.storeServiceInventoryRules.isOpenServiceInventory,
          "processTimes": processTimes
        }
        this.storeListService.updatetoreervicenventoryrules(json).then(res => {
          this._isConfirmLoading = false;
          if(utils.getStatusCode(res.code) == config.successCode){
            this.notificationService.create('success','保存服务设置成功','');
            this.subject.destroy('onOk');
          }else{
            this.notificationService.create('error',res.message,'');
          }
        }).catch(err => {
          console.log(err)
          this._isConfirmLoading = false;
          this.notificationService.create('error','网络连接失败','');
        })
      }
    }else if(this.from == 'storeAddGoods' || this.from == 'storeInventory'){
      let json1 = {
        "storeId": this.id,
        "defaultProcessTime": Number(this._editParams.advanceService) * 60,
        "times": this._serviceTime,
        "processTimes": processTimes
      }
      this._isConfirmLoading = true;
      this.storeListService.addtoreervicenventoryrules(json1).then(res => {
        this._isConfirmLoading = false;
        if(utils.getStatusCode(res.code) == config.successCode){
          this.notificationService.create('success','服务设置成功','');
          this.subject.destroy('onOk');
        }else{
          this.notificationService.create('error',res.message,'');
        }
      }).catch(err => {
        console.log(err)
        this._isConfirmLoading = false;
        this.notificationService.create('error','网络连接失败','');
      })
    }
  }

  handleCancel(e){
      this.subject.destroy('onCancel');
  }

  // 时间控件相关 start
  addServiceTime(begin,end){
    if(!begin){
      this.notificationService.create('error','请设置起始时间后再添加','');
      return;
    }
    if(!end){
      this.notificationService.create('error','请设置结束时间后再添加','');
      return;
    }

    // 遍历服务时间  检查新增的服务时间是否在之前的时间区间内 ， 在则提示用户  不让用户添加
    for(let item of this._serviceTime){
      if(this.storeManagementService.isExistIntersectionForServiceTime(begin,item.timeStart,item.timeEnd,end)){
        this.notificationService.create('error','添加失败：添加的多个时间段不能有重叠','');
        return;
      }
    }
    
    this._serviceTime.push({
      "timeStart": begin,
      "timeEnd": end
    })
    this._startDate = null;
    this._endDate = null;

    this.startDisabledHours = () => {
      return []
    }
    this.endDisabledHours = () =>{
      return [];
    }
  }

  deleteServiceTime(item){
    let idx = this._serviceTime.indexOf(item);
    this._serviceTime.splice(idx, 1);
  }

  timeCondition(){
    this._metaData.push({
      "timeStart" : null,
      "timeEnd": null,
      "processTime": 0,
      "EndDisabled": false,
      "itemStartDisabledHours": () => {
        return []
      },
      "itemEndtDisabledHours": () => {
        return []
      },
      "itemStartDisabledMinutes": (h) => {
        let arr = this.newArray(0,60);
        arr.splice(0,1)
        arr.splice(29,1)
        return arr
      },
      "itemEndDisabledMinutes": (h) => {
        let arr = this.newArray(0,60);
        arr.splice(0,1)
        arr.splice(29,1)
        return arr
      }
    })
  }

  _startValueChange(e){
    if(e){
      var oHours = e.getHours();
      this.endDisabledHours = () => {
        let arr = this.newArray(0,24);
        arr.splice(oHours + 1, 24 - oHours)
        return arr
      }
    }
    
  }

  _endValueChange(e){
    if(e){
      var oHours = e.getHours();
      this.startDisabledHours = () => {
        let arr = this.newArray(0,24);
        arr.splice(0, oHours)
        return arr
      }
    }
  }

  startDisabledHours = () => {
    return []
    
  }

  endDisabledHours = () =>{
    return [];
  }


  newArray = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  _itemStartValueChange(item,index){
    if(item.timeStart){
      if(item.timeStart.getMinutes() == 30){
        item.timeStart = new Date(item.timeStart.getFullYear() + "/" + (item.timeStart.getMonth() + 1) + "/" + item.timeStart.getDate() + " " +item.timeStart.getHours() + ":30:00")
      }else{
        item.timeStart = new Date(item.timeStart.getFullYear() + "/" + (item.timeStart.getMonth() + 1) + "/" + item.timeStart.getDate() + " " +item.timeStart.getHours() + ":00:00")
      }
      
      if(item.timeEnd){
        let dHours = item.timeStart.getHours();
        let oHours = item.timeEnd.getHours();
        let oMinutes = item.timeEnd.getMinutes();
        if(dHours == oHours){
          if(oMinutes == 30){
            item.timeStart = new Date(item.timeStart.getFullYear() + "/" + (item.timeStart.getMonth() + 1) + "/" + item.timeStart.getDate() + " " +item.timeStart.getHours() + ":00:00")
          }else{
            item.timeStart = new Date(item.timeStart.getFullYear() + "/" + (item.timeStart.getMonth() + 1) + "/" + item.timeStart.getDate() + " " +item.timeStart.getHours() + ":30:00")
          }
        }
        if(item.timeStart.getTime() > item.timeEnd.getTime()){
          setTimeout(() => {
            item.timeStart = null;
          }, 0);
          return;
        }
      }
      for(let i in this._metaData){
        // 不与本身校验
        if(i == index){
          continue;
        }
        // 其他行必须保证开始时间和结束时间都有值时才校验
        if(!this._metaData[i].timeStart || !this._metaData[i].timeEnd){
          continue;
        }

        if(item.timeEnd){
          if(this.storeManagementService.isExistIntersectionForMetaData(item.timeStart,this._metaData[i].timeStart,this._metaData[i].timeEnd,item.timeEnd)){
            this.notificationService.create('error','添加失败：添加的多个时间段不能有重叠','');
            setTimeout(() => {
              item.timeStart = null;
            }, 0);
            return;
          }
        }else{
          if(this.storeManagementService.isExistIntersectionForMetaData(item.timeStart,this._metaData[i].timeStart,this._metaData[i].timeEnd)){
            this.notificationService.create('error','该时间点已经设置,请检查后重新设置','');
            setTimeout(() => {
              item.timeStart = null;
            }, 0);
            return;
          }
        }
      }
      var oHours = item.timeStart.getHours();
      var oMinutes = item.timeStart.getMinutes();
      switch(oMinutes){
        case 0:
          item.itemEndtDisabledHours = () => {
            let arr = this.newArray(0,24);
            arr.splice(oHours, 24 - oHours)
            return arr
          }
          item.itemEndDisabledMinutes = (h) =>{
            let arr = this.newArray(0,60);
            arr.splice(0,1)
            arr.splice(29,1)
            if(h === oHours){
              arr.push(0)
            }
            return arr
          }
          item.EndDisabled = false;
          break;
        case 30:
          if(oHours == 23){
            item.timeEnd = new Date(item.timeStart.getFullYear() + "/" + (item.timeStart.getMonth() + 1) + "/" + item.timeStart.getDate() + ' 24:00');
            item.EndDisabled = true;
          }else{
            item.EndDisabled = false;
          }
          item.itemEndtDisabledHours = () => {
            let arr = this.newArray(0,24);
            arr.splice(oHours + 1, 24 - oHours)
            return arr
          }
          break;
      }
    }
  }

  _itemEndValueChange(item,index){
    if(item.timeEnd){
      if(item.timeEnd.getMinutes() == 30){
        item.timeEnd = new Date(item.timeEnd.getFullYear() + "/" + (item.timeEnd.getMonth() + 1) + "/" + item.timeEnd.getDate() + " " +item.timeEnd.getHours() + ":30:00")
      }else{
        item.timeEnd = new Date(item.timeEnd.getFullYear() + "/" + (item.timeEnd.getMonth() + 1) + "/" + item.timeEnd.getDate() + " " +item.timeEnd.getHours() + ":00:00")
      }
      if(item.timeStart){
        let dHours = item.timeStart.getHours();
        let oHours = item.timeEnd.getHours();
        let oMinutes = item.timeStart.getMinutes();
        if(dHours == oHours){
          if(oMinutes == 30){
            item.timeEnd = new Date(item.timeEnd.getFullYear() + "/" + (item.timeEnd.getMonth() + 1) + "/" + item.timeEnd.getDate() + " " +item.timeEnd.getHours() + ":00:00")
          }else{
            item.timeEnd = new Date(item.timeEnd.getFullYear() + "/" + (item.timeEnd.getMonth() + 1) + "/" + item.timeEnd.getDate() + " " +item.timeEnd.getHours() + ":30:00")
          }
        }
        if(item.timeStart.getTime() > item.timeEnd.getTime()){
          setTimeout(() => {
            item.timeEnd = null;
          }, 0);
          return;
        }
      }
      for(let i in this._metaData){
        // 不与本身校验
        if(i == index){
          continue;
        }
        // 其他行必须保证开始时间和结束时间都有值时才校验
        if(!this._metaData[i].timeStart || !this._metaData[i].timeEnd){
          continue;
        }

        if(item.timeStart){
          if(this.storeManagementService.isExistIntersectionForMetaData(item.timeStart,this._metaData[i].timeStart,this._metaData[i].timeEnd,item.timeEnd)){
            this.notificationService.create('error','添加失败：添加的多个时间段不能有重叠','');
            setTimeout(() => {
              item.timeEnd = null;
            }, 0);
            return;
          }
        }else{
          if(this.storeManagementService.isExistIntersectionForMetaData(item.timeEnd,this._metaData[i].timeStart,this._metaData[i].timeEnd)){
            this.notificationService.create('error','该时间点已经设置,请检查后重新设置','');
            setTimeout(() => {
              item.timeEnd = null;
            }, 0);
            return;
          }
        }
      }
      var oHours = item.timeEnd.getHours();
      var oMinutes = item.timeEnd.getMinutes();
      switch(oMinutes){
        case 0:
          item.itemStartDisabledHours = () => {
            let arr = this.newArray(0,24);
            arr.splice(0, oHours)
            return arr
          }
          break;
        case 30:
          item.itemStartDisabledHours = () => {
            let arr = this.newArray(0,24);
            arr.splice(0, oHours + 1)
            return arr
          }
          item.itemStartDisabledMinutes = (h) =>{
            let arr = this.newArray(0,60);
            arr.splice(0,1)
            arr.splice(29,1)
            if(h === oHours){
              arr.push(30)
            }
            return arr
          }
          break;
      }
    }
  }

  deleteItem(item){
    let idx = this._metaData.indexOf(item);
    this._metaData.splice(idx, 1);
  }
  // 时间控件相关end

   getFormControl(name){
    return this._validateForm.controls[name];
  }

  // 验证器
  advanceServiceValidator = (control: FormControl): { [s: string]: boolean } => {
    const ADVANCESERVICE_REGEXP = /^[0-9]{1,3}$/;
    if (!control.value) {
        return { required: true }
    } else if (!ADVANCESERVICE_REGEXP.test(control.value)) {
        return { error: true, advanceService: true };
    }else if(control.value > 168){
        return { error: true, time: true };
    }
};
}
