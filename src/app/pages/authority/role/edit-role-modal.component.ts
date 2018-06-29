import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { AuthorityService } from "../authority.service";
import { NzMessageService } from 'ng-zorro-antd';
import { CodeHelperService } from "../../../core/code-helper.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { error } from 'util';


@Component({
  selector: 'edit-role-component',
  templateUrl: './edit-role-modal.component.html',
  styleUrls: ['./edit-role-modal.component.scss']
})
export class RoleEditModalComponent implements OnInit {

	validateForm: FormGroup;
	isLoading = false;
	_id:string;
	_name:string;
  _type:number;
  @Input()
  set type(value:any){
    this._type = value;
  }  
	@Input()
	set id(value:string){
		this._id = value;
	}
	@Input()
	set name(value:string){
		this._name = value;
	}	
  constructor(
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private authorityService: AuthorityService,
    private message: NzMessageService,
    private codeHelperService: CodeHelperService,
  ) { }
  ngOnInit() {
    if(this._type==0){    
      this.validateForm = this.fb.group({
        name         : [ this._name, [ Validators.required ] ],
      });
    }else{
      this.validateForm = this.fb.group({
        name         : [ '', [ Validators.required ] ],
      });      
    }
  }
  update(){
    this.isLoading = true;
    this.authorityService.roleUpdate({id:this._id,name:this.validateForm.value.name}).then(res=>{
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
    this.authorityService.addRole({name:this.validateForm.value.name}).then(res=>{
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