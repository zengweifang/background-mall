import { Component, OnInit, Input } from '@angular/core';
import { NzModalSubject,NzNotificationService} from 'ng-zorro-antd';
import { FormBuilder, FormGroup, FormControl,Validators } from "@angular/forms";
import { OrderMsgService } from './../order-msg.service';
import { ValidatorService } from "../../../../core/validator.service";
@Component({
  selector: 'app-add-and-edit-modal',
  templateUrl: './add-and-edit-modal.component.html',
  styleUrls: ['./add-and-edit-modal.component.scss']
})
export class AddAndEditModalComponent implements OnInit {

  
  _addAndEditForm: FormGroup
  _orderInfo = {
    name: '',
    gender: '',
    phone: '',
    address: '',
    userPhone: ''
  }

  _isAdd:boolean = false;
  _id: string = ''

  _isConfirmLoading: boolean = false;
  @Input()
  set phone(value:string){
      this._orderInfo.phone = value;
      this._isAdd = true;
  }

  @Input()
  set basePhone(value:string){
      this._orderInfo.userPhone = value;
  }

  @Input()
  set data(value){
    this._orderInfo.name = value.name;
    this._orderInfo.gender = value.gender;
    this._orderInfo.phone = value.phone;
    this._orderInfo.address = value.pname + value.cityname + value.adname + value.poiName + value.address;
    this._isAdd = false;
    this._id = value.id;
  }
  constructor(private fb: FormBuilder,private orderMsgService: OrderMsgService,private validatorService: ValidatorService,private subject: NzModalSubject,private notificationService: NzNotificationService) { }

  ngOnInit() {
    this._addAndEditForm = this.fb.group({
      name: ['',this.validatorService.nameValidator],
      gender: ['',Validators.required],
      phone: ['',this.validatorService.phoneValidator],
      address: ['',this.validatorService.addressValidator]
    });
    
  }

  emitDataOutside(){
    if(this._isAdd){
      this._isConfirmLoading = true;
      this.orderMsgService.addAddress(this._orderInfo).then(res => {
        this._isConfirmLoading = false;
        this.notificationService.create('success','新建地址成功','');
        this.subject.destroy('onOk');
      }).catch(err => {
        console.log(err)
        this._isConfirmLoading = false;
        this.notificationService.create('error','新建地址失败','');
      })
    }else{
      this._isConfirmLoading = true;
      let param = {
        id: this._id,
        name: this._orderInfo.name,
        phone: this._orderInfo.phone,
        userPhone: this._orderInfo.userPhone,
        gender: this._orderInfo.gender,
        address: this._orderInfo.address
      }
      this.orderMsgService.updateAddress(param).then(res => {
        this._isConfirmLoading = false;
        this.notificationService.create('success','编辑地址成功','');
        this.subject.destroy('onOk');
      }).catch(err => {
        console.log(err)
        this._isConfirmLoading = false;
        this.notificationService.create('error','编辑地址失败','');
      })
    }
    
  }

  handleCancel(e){
      this.subject.destroy('onCancel');
  }

  getFormControl(name){
    return this._addAndEditForm.controls[name];
  }

}
