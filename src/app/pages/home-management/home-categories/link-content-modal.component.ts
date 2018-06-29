import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { HomeManagementService } from '../home-management.service';
import { NzMessageService } from 'ng-zorro-antd';
import { CodeHelperService } from "../../../core/code-helper.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { error } from 'util';
import { getPageParams } from '../../../core/page.config';


@Component({
  selector: 'nz-demo-component',
  templateUrl: './link-content-modal.component.html',
	styleUrls: ['./link-content-modal.component.css']
})
export class LinkContentModalComponent implements OnInit {
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
    private homeManagementService: HomeManagementService,
    private message: NzMessageService,
    private codeHelperService: CodeHelperService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name         : [ '', [ ] ],
    });

    this.refreshData();
  }

  _params = {
    name: '',
    page: getPageParams(),
  }

  dataSet = [];

  total = 0;
  loading = false;

  selectedGroup = null;


  refreshData(reset = false) {
    if (reset) {
      this._params.page.currentPage = 1;
    }
    this.selectedGroup = null;
    this.loading = true;
      this.homeManagementService
        .getContentGroupList(this._params).then(resp => {
          this.loading = false;
          if (!this.codeHelperService.isServerError(resp)) {
            this.dataSet = resp.data.dataList;
            this.total = resp.data.page.totalCount;
          } else {
            this.message.create('error', resp.message || '加载失败');
          }
        }).catch(error => {
          this.loading = false;
          this.message.create('error', '加载失败');
        })
  }

  confirm() {
    // console.log(this.selectedGroup);
    // this.subject.destroy('onOk');
    this.subject.next(this.selectedGroup);
    this.subject.destroy('onOk');
  }

  selectGroup(item: any) {
    this.selectedGroup = item;
  }

  // _submitForm() {
  //   for (const i in this.validateForm.controls) {
  //     this.validateForm.controls[ i ].markAsDirty();
  //   }

  //   if (this.validateForm.controls['alias'].valid && this.validateForm.controls['alias'].valid) {
  //     this.isLoading = true;
  //     this.homeManagementService
  //       .getContentGroupList({
  //         alias: this.validateForm.controls['alias'].value ? this.validateForm.controls['alias'].value : '',
  //         name: this.validateForm.controls['name'].value ? this.validateForm.controls['name'].value : '',
  //         describe: this.validateForm.controls['describe'].value ? this.validateForm.controls['describe'].value : ''
  //       }).then(resp => {
  //         this.isLoading = false;
  //         if (!this.codeHelperService.isServerError(resp)) {
  //           this.message.create('success', '操作成功')
  //           this.subject.destroy('onOk');
  //         } else {
  //           this.message.create('error', resp.message ? resp.message : '注册失败');
  //         }
  //       }).catch(error => {
  //         this.isLoading = false;
  //         this.message.create('error', '注册失败')
  //       })
  //   }
  // }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }
}