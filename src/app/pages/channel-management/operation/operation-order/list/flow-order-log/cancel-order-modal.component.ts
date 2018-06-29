import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { OperationListService } from '../../../operation-list.service';
import { NzMessageService } from 'ng-zorro-antd';
import { CodeHelperService } from "../../../../../../core/code-helper.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { error } from 'util';


@Component({
  selector: 'cancel-order-modal',
  templateUrl: './cancel-order-modal.component.html',
  styleUrls: ['./cancel-order-modal.component.css']
})
export class CancelOrderModalComponent implements OnInit {
  constructor(
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private operationListService: OperationListService,
    private message: NzMessageService,
    private codeHelperService: CodeHelperService,
  ) { }

  @Input() metadata: any;
  @Input() orderId: string;

  submitParams = {
    reasonId: '',
    desc: '',
    orderId: '',
    operation:3//operation  3:取消订单
  };

  handleCancel(e) {
    this.subject.destroy('onCancel');
  }
  ngOnInit() {
    this.submitParams.orderId = this.orderId;
  }

  _submitForm() {
    this.operationListService
      .manageDistributionOrder(this.submitParams).then(resp => {
        if (!this.codeHelperService.isServerError(resp)) {
          this.message.create('success', '操作成功')
          this.subject.destroy('onOk');
        } else {
          this.message.create('error', resp.message ? resp.message : '操作失败');
        }
      }).catch(error => {
        this.message.create('error', '操作失败')
      });
  }
}