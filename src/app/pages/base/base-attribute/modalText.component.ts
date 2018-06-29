import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { NzModalSubject } from 'ng-zorro-antd';
import { MetaData } from '../../../shared/class/mete-data'

@Component({
  selector: 'app-modalText',
  templateUrl: './modalText.component.html',
  styleUrls: ['./base-attribute-list/base-attribute-list.component.css']
})
export class ModalTextComponent implements OnInit {
  _data=[];
  //元数据
	metaData: MetaData;
  tempData;
  @Input()
  set data(value: Array<Object>) {
    // value[0]['sort'] = 1;
    console.log(value)
    this._data = value;
  }

  validateForm: FormGroup;

  //提交
  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
    }
    // this.subject.next(this._data);
    // this.subject.destroy('onCancel');
    this.subject.destroy();
  };
  getFormControl(name) {
    return this.validateForm.controls[name];
  }

  regValidator = (control: FormControl): { [s: string]: boolean } => {
    const REG_REGEXP = /^\/.*\/$/;
    if (this._data[0].textConstraintType == 5) {
      if (!control.value) {
        return { required: true }
      } else if (!REG_REGEXP.test(control.value)) {
        return { error: true, regex: true };
      }
    }

  };

  handleCancel(e) {
    // this.subject.destroy();
  }

  constructor(private subject: NzModalSubject, private fb: FormBuilder) {
    this.metaData = {
      attrTypes : [{ id: 0, name: '单行文本框' }, { id: 1, name: '下拉菜单' }, { id: 2, name: '时间控件' }],
      timeScopes : [{ id: 1, name: '精确到时' }, { id: 2, name: '精确到天' }, { id: 3, name: '精确到月' }, { id: 0, name: '精确到分' }],
      scopes : [{ id: 0, name: '供应商' }, { id: 1, name: '用户' }],
      textConstraintTypes : [{ id: 0, name: '无限制' }, { id: 1, name: '手机' }, { id: 2, name: '身份证' }, { id: 3, name: '邮箱' }, { id: 4, name: '姓名' }, { id: 5, name: '正则表达式' }],
      status : [{id:0,name:'关闭'},{id:1,name:'待开启'},{id:2,name:'开启'}]
    }
  };

  ngOnInit() {
    this.validateForm = this.fb.group({
      content: [null, [Validators.required]],
      sort: 1,
      textConstraintType: 0,
      regex: ['', [this.regValidator]]
    });
    this.subject.on('onDestory', () => {
      console.log('destroy');
    });
  }


}
