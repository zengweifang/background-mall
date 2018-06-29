import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { CommonService } from '../../../../shared/services/common.service';
import { CustomModalService } from '../../../../shared/services/custom-modal.service';
import { StoreAddBasicService } from './store-add-basic.service';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-store-add-basic',
  templateUrl: './store-add-basic.component.html',
  styleUrls: ['./store-add-basic.component.scss']
})
export class StoreAddBasicComponent implements OnInit {
  _current:number = 0
  _storeManagerAddBasicForm: FormGroup
  _providerId = utils.getSessionStorage('userId');
  _reqParam = {
    name: '',
    phone: '',
    notice: '',
    providerid: this._providerId
  }
  _saveLoading: boolean = false
  _canDeactivate: boolean = false;
  constructor(private fb: FormBuilder,private message: NzMessageService,public customModalService: CustomModalService,private router:Router,private commonService:CommonService,private storeAddBasicService: StoreAddBasicService,private notificationService: NzNotificationService) { }

  ngOnInit() {
    this._storeManagerAddBasicForm = this.fb.group({
      name: ['',this.nameValidator],
      notice: ['',this.noticeValidator],
      phone: ['', this.phoneValidator],
      
    });
  }

  _submitForm(){
    this._saveLoading = true;
    this.storeAddBasicService.create(this._reqParam).then(res => {
      this._saveLoading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        this.notificationService.create('success','创建店铺成功','');
        this._canDeactivate = true;
        this.router.navigate(['/storeManagement/storeAdd/storeAddArea',res.data], {queryParams: {from: 'add'}})
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      console.log(err)
      this._saveLoading = false;
      this.message.create('error', '网络加载失败');
    })
  }

  getFormControl(name){
    return this._storeManagerAddBasicForm.controls[name];
  }
  // 处理未保存的更改  路由守卫
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    // observable  貌似不行  Promise<boolean> | boolean 可以
    if ((!this._reqParam.name && !this._reqParam.notice && !this._reqParam.phone) || this._canDeactivate){
        return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    
    return new Promise(resolve => {
      this.customModalService._confirm({
        title:'温馨提示',
        content: '如果确认返回，刚编辑的信息不会被保存。',
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

  // 验证器
  // 店铺名称
  nameValidator = (control: FormControl): { [s: string]: boolean } => {
    const NAME_REGEXP = /^[\u4e00-\u9fa5a-zA-Z]{2,25}$/;
    if (!control.value) {
        return { required: true }
    } else if (!NAME_REGEXP.test(control.value)) {
        return { error: true, name: true };
    }
  };
  // 店铺公告
  noticeValidator = (control: FormControl): { [s: string]: boolean } => {
    const NOTICE_REGEXP = /^[\u4e00-\u9fa5a-zA-Z0-9_]{1,100}$/;
    if (!control.value) {
        // return { required: true }
    } else if (!NOTICE_REGEXP.test(control.value)) {
        return { error: true, notice: true };
    }
  };
  // 客服电话
  phoneValidator = (control: FormControl): { [s: string]: boolean } => {
    const PHONE_REGEXP = /^[0-9]{7,14}$/;
    if(!control.value){
        return { required: false }
    }else if (!PHONE_REGEXP.test(control.value)) {
        return { error: true, phone: true };
    }
    
};


  goBack(){
    this.router.navigate(['/storeManagement/storeList/storeList'])
  }
}
