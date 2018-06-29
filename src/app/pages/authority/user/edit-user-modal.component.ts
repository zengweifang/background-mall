import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { AuthorityService } from "../authority.service";
import { NzMessageService } from 'ng-zorro-antd';
import { CodeHelperService } from "../../../core/code-helper.service";
import { ValidatorService } from "../../../core/validator.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { error } from 'util';


@Component({
  selector: 'edit-user-component',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class UserEditModalComponent implements OnInit {

	validateForm: FormGroup;
	isLoading = false;
	_item:any;
  _type:number;
  password:'';
  @Input()
  set item(value:any){
    this._item = value;
  }  
  set type(value:any){
    this._type = value;
  }  
  constructor(
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private authorityService: AuthorityService,
    private message: NzMessageService,
    private codeHelperService: CodeHelperService,
    private validatorService: ValidatorService
  ) { }
  ngOnInit() {
    if(this._type==0){    
      this.validateForm = this.fb.group({
        userName: [ this._item.userName, [ Validators.required ] ],
        password: [ this.password, [ this.validatorService.passwordValidator ] ]
      });
    }else{
      this.validateForm = this.fb.group({
        name: [ '', [ this.validatorService.nameValidator ] ],
        userName: [ '', [ this.validatorService.accountValidator ] ],
        password: [ '', [ this.validatorService.passwordValidator ] ]
      });
    }
  }
  update(){
    this.isLoading = true;
    this.authorityService.userUpdate({id:this._item.userId,name:this._item.userName,password:this.validateForm.value.password}).then(res=>{
      this.isLoading = false;
      this.subject.destroy('onOk');
      this.message.create('success', '修改成功');
    }).catch(err=>{
      this.isLoading = false;
      this.message.error('网络连接失败')
    })    
  }
  add(){
    this.isLoading = true;
    this.authorityService.addUser({name:this.validateForm.value.name,userName:this.validateForm.value.userName,password:this.validateForm.value.password}).then(res=>{
      this.isLoading = false;
      this.subject.destroy('onOk');
      this.message.create('success', '添加成功');
    }).catch(err=>{
      this.isLoading = false;
      this.message.error('网络连接失败')
    })       
  }
  submit(){
     if(this._type==0){
       this.update();
     }else{
       this.add();
     }
  }
  cancel(){
  	this.subject.destroy('onCancel');
  }

}