import { Component, OnInit } from '@angular/core';
import { BusinessListService } from "../business-list/business-list.service";
import { CodeHelperService } from "../../../../core/code-helper.service";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { NzModalSubject } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-business-add',
  templateUrl: './business-add.component.html',
  styleUrls: ['./business-add.component.css']
})
export class BusinessAddComponent implements OnInit {

  validateForm: FormGroup;

  constructor(
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private businessListService: BusinessListService,
		private codeHelperService: CodeHelperService,
		private message: NzMessageService,
  ) {
  }
  _loading = false;

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      type: [0, [Validators.required]],
      channelAccount: [null, [Validators.required]],
      hasChildren: [0, [Validators.required]],
      appid: [null, [Validators.required]],
      appSecret: [null, [Validators.required]],
      customPrice: [0, [Validators.required]],
      k3id: [null]
    });
  }

  getFormControl(name) {
    return this.validateForm.controls[name];
  }
  /* event response */
  handleCancel(e) {
    this.subject.destroy('onCancel');
  }

  selectType(index:number) {
    if (index === 0) {
      this.validateForm.controls['appid'].reset();
      this.validateForm.controls['appSecret'].reset();
    }
  }

  _submitForm = ($event, value) => {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      console.log(this.validateForm.controls[key].valid);
    }
    if (this.getFormControl('type').value == 1 && this.validateForm.valid) {
      this.addNewChannel(value);
    } else if (
      this.getFormControl('name').valid
      && this.getFormControl('channelAccount').valid
    ) {
      this.addNewChannel(value);
    }
  };



  addNewChannel(params:any) {
    this._loading = true;
    this.businessListService.addNewChannel(params).then(resp => {
      this._loading = false;
      if (!this.codeHelperService.isServerError(resp)) {
        this.message.create('success', resp.message ? resp.message : '新增成功');
        this.subject.destroy('onOk');
      } else {
        this._loading = false;
        this.message.create('error', resp.message ? resp.message : '新增失败');
      }
    }).catch(error => {
      this._loading = false;
				this.message.create('error', '新增失败');
    })
  }

}
