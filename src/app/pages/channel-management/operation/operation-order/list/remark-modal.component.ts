import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { OperationListService } from '../../operation-list.service';
import { NzMessageService } from 'ng-zorro-antd';
import { CodeHelperService } from "../../../../../core/code-helper.service";
import { utils } from "../../../../../shared/utils/utils";
import { remarkTag } from "./remarkTag";
import { ServiceRemark } from "./serviceRemark";
import { DisplayTag } from "./displayTag";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { error } from 'util';


@Component({
  selector: 'nz-demo-component',
  templateUrl: './remark-modal.component.html',
  styleUrls: ['./remark-modal.component.css']
})
export class RemarkModalComponent implements OnInit {
  validateForm: FormGroup;

  isLoading = false;

  @Input() mainKeyId: string;
  @Input() customerServiceRemark: ServiceRemark;

  handleCancel(e) {
    this.subject.destroy('onCancel');
  }

  constructor(
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private operationListService: OperationListService,
    private message: NzMessageService,
    private codeHelperService: CodeHelperService,
  ) { }

  obj = {

  }

  tagTypes = [];
  ngOnInit() {
    this.customerServiceRemark.tagList.forEach(element => {
      let displayTag: DisplayTag = new DisplayTag;
      displayTag.label = element.tag;
      displayTag.value = element.type;
      displayTag.checked = element.selected;
      this.tagTypes.push(displayTag);
    });
    this.validateForm = this.fb.group({
      content: [this.customerServiceRemark.content,],
      tagTypes: [this.tagTypes,],
      orderId: [this.mainKeyId,],
      operater: [utils.getSessionStorage("userId")]
    });
  }

  _submitForm() {
    let params = this.validateForm.value;
    let tagTypesId = [];
    params.tagTypes.forEach(element => {
      if (element.checked) {
        tagTypesId.push(element.value);
      }
    });
    params.tagTypes = tagTypesId;
    this.isLoading = true;
    this.operationListService
      .addRemark(params).then(resp => {
        this.isLoading = false;
        if (!this.codeHelperService.isServerError(resp)) {
          this.message.create('success', '添加成功')
          this.subject.destroy('onOk');
        } else {
          this.message.create('error', resp.message ? resp.message : '添加失败');
        }
      }).catch(error => {
        this.isLoading = false;
        this.message.create('error', '添加失败')
      })
  }

  getFormControl(name) {
    return this.validateForm.controls[name];
  }
}