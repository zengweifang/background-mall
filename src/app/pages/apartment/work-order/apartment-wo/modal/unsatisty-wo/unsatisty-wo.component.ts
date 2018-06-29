import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,FormControl } from "@angular/forms";
import { NzModalSubject } from 'ng-zorro-antd';

@Component({
  selector: 'app-unsatisty-wo',
  templateUrl: './unsatisty-wo.component.html',
  styleUrls: ['./unsatisty-wo.component.scss']
})
export class UnsatistyWoComponent implements OnInit {

  validateForm: FormGroup;
  params={};
  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }
  constructor(private fb:FormBuilder,private subject:NzModalSubject) { }

  emitDataOutside() {
    this.subject.next(this.params);
    this.subject.destroy('onCancel');
  }

  handleCancel(e) {
    this.subject.destroy('onCancel');
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      unsatistyCommont:[null]
    })
  }
}
