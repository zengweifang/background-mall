import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { OauthRegisterService } from '../oauth-register.service';
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
  selector: 'nz-demo-component',
  templateUrl: './resourses-register-add-modal.component.html',
	styleUrls: ['./resourses-register-add-modal.component.css']
})
export class ResoursesRegisterAddModalComponent implements OnInit {
  validateForm: FormGroup;
  
  _name: string;
  isLoading = false;

  @Input()
  set name(value: string) {
    this._name = value;
  }
  
  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsDirty();
    }
  };

  handleCancel(e) {
    this.subject.destroy('onCancel');
  }

  constructor(
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private oauthRegisterService: OauthRegisterService,
    private message: NzMessageService,
    private codeHelperService: CodeHelperService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      alias            : [ null, [ Validators.required ] ],
      name         : [ null, [ Validators.required ] ],
      describe         : [ null, ],
    });
  }

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }

    if (this.validateForm.controls['alias'].valid && this.validateForm.controls['alias'].valid) {
      this.isLoading = true;
      this.oauthRegisterService
        .registerResourse({
          alias: this.validateForm.controls['alias'].value ? this.validateForm.controls['alias'].value : '',
          name: this.validateForm.controls['name'].value ? this.validateForm.controls['name'].value : '',
          describe: this.validateForm.controls['describe'].value ? this.validateForm.controls['describe'].value : ''
        }).then(resp => {
          this.isLoading = false;
          if (!this.codeHelperService.isServerError(resp)) {
            this.message.create('success', '操作成功')
            this.subject.destroy('onOk');
          } else {
            this.message.create('error', resp.message ? resp.message : '注册失败');
          }
        }).catch(error => {
          this.isLoading = false;
          this.message.create('error', '注册失败')
        })
    }
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }
}