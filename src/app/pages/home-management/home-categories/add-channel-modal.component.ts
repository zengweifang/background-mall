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
  selector: 'add-channel-modal-component',
  templateUrl: './add-channel-modal.component.html',
	styleUrls: ['./add-channel-modal.component.css']
})
export class AddChannelModalComponent implements OnInit {
  validateForm: FormGroup;
  
  isLoading = false;

  @Input()
  set homePageCategoryId(value: string) {
    this._params.homePageCategoryId = value;
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
    homePageCategoryId: '',
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
        .getExcludeChannelList(this._params).then(resp => {
          this.loading = false;
          if (!this.codeHelperService.isServerError(resp)) {
            this.dataSet = resp.data ? resp.data.dataList : [];
            this.total = resp.data ? resp.data.page.totalCount : 0;
            this._displayDataChange(this.dataSet);
          } else {
            this.message.create('error', resp.message || '加载失败');
          }
        }).catch(error => {
          this.loading = false;
          this.message.create('error', '加载失败');
        })
  }

  confirm() {
    let ids = this._displayData.filter(item => item.checked).map(x => x.channelID);
    this.homeManagementService.saveChannelRel({
      homePageCategoryId: this._params.homePageCategoryId,
      channelIdList:ids
    }).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.subject.destroy('onOk');
      } else {
        this.message.create('error', resp.message || '操作失败');
      }
    }).catch(err => {
      this.loading = false;
      this.message.create('error', '操作失败');
    })
  }

  _allChecked = false;
  _indeterminate = false;
  _displayData = [];

  _displayDataChange($event) {
    this._displayData = $event;
    this._refreshStatus();
  }

  _refreshStatus() {
    const allChecked = this._displayData.every(value => value.disabled || value.checked) && this._displayData.length > 0;
    const allUnChecked = this._displayData.every(value => value.disabled || !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
  }

  _checkAll(value) {
    if (value) {
      this._displayData.forEach(data => {
        if (!data.disabled) {
          data.checked = true;
        }
      });
    } else {
      this._displayData.forEach(data => data.checked = false);
    }
    this._refreshStatus();
  }


  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }
}