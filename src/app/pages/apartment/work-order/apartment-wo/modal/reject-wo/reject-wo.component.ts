import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,FormControl } from "@angular/forms";
import { NzModalSubject } from 'ng-zorro-antd';

@Component({
  selector: 'app-reject-wo',
  templateUrl: './reject-wo.component.html',
  styleUrls: ['./reject-wo.component.scss']
})
export class RejectWoComponent implements OnInit {
  validateForm: FormGroup;
  cancelParams={};
  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }
  constructor(private fb:FormBuilder,private subject:NzModalSubject) { }

  emitDataOutside() {
    this.subject.next(this.cancelParams);
    this.subject.destroy('onCancel');
  }

  handleCancel(e) {
    this.subject.destroy('onCancel');
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      rejectReason:[null],
      rejectType:[null]
    })
  }

}
