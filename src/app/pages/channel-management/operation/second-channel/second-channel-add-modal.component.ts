import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { CodeHelperService } from "../../../../core/code-helper.service";
import { NzMessageService } from 'ng-zorro-antd';
import { OperationListService } from '../operation-list.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { error, debug } from 'util';


@Component({
  selector: 'nz-demo-component',
  templateUrl: './second-channel-add-modal.component.html',
  styleUrls: ['./second-channel-add-modal.component.css']
})
export class SecondChannelAddModalComponent implements OnInit {
  constructor(
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private operationListService: OperationListService,
    private message: NzMessageService,
    private codeHelperService: CodeHelperService,
  ) { }

  validateForm: FormGroup;

  _name: string;
  isLoading = false;
  channelAddParams = {
    type: 0,
    customPrice: 0,
    parentId: '',
    hasChildren: 0,
    name: '',
    channelAccount: '',
  }

  @Input()
  set channelId(value: string) {
    this.channelAddParams.parentId = value;
  }
  @Input() channelName: string;

  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
    }
  };

  handleCancel(e) {
    this.subject.destroy('onCancel');
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      channelAccount: [null, [Validators.required]],
    });
  }

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }

    if (this.validateForm.controls['name'].valid && this.validateForm.controls['channelAccount'].valid) {
      this.isLoading = true;
      this.validateForm.controls['name'];
      this.channelAddParams.name = this.validateForm.controls['name'].value;
      this.channelAddParams.channelAccount = this.validateForm.controls['channelAccount'].value;

      this.operationListService
        .addNewSecondChannel(this.channelAddParams).then(resp => {
          this.isLoading = false;
          if (!this.codeHelperService.isServerError(resp)) {
            this.message.create('success', '新增成功')
            this.subject.destroy('onOk');
          } else {
            this.message.create('error', resp.message ? resp.message : '新增失败');
          }
        }).catch(error => {
          this.isLoading = false;
          this.message.create('error', '新增失败')
        });
    }
  }

  getFormControl(name) {
    return this.validateForm.controls[name];
  }
}