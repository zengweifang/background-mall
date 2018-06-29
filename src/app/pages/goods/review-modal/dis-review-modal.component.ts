import { Component, OnInit,Input } from '@angular/core';
import { NzMessageService, NzModalService, NzModalSubject } from 'ng-zorro-antd';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CodeHelperService } from "../../../core/code-helper.service";
import { ValidatorService } from "../../../core/validator.service";

import { CommonService } from "../../../shared/services/common.service";
import { GoodsReviewService } from "../goods.service";
@Component({
    selector: 'dis-review-modal',
    templateUrl: './dis-review-modal.component.html',
    styleUrls: ['../../../app.component.scss']
})
export class DisReviewModalComponent implements OnInit {
    validateForm:FormGroup;
    isConfirmLoading=false;
    reviewFailParams={status:12,goodId:"",reviewerId:sessionStorage.getItem('userId')};
    constructor(private fb: FormBuilder,
        private message: NzMessageService,
        private validatorService:ValidatorService,
        private goodsReviewService:GoodsReviewService,
        private subject:NzModalSubject) {
    }
    _goodsId:string;

    @Input()
    set goodsId(value:string){
        this._goodsId = value;
    }

    emitDataOutside(){
        this.isConfirmLoading = true;
        this.goodsReviewService.doreview(this.reviewFailParams).then(res => {
            res["status"] = true;
            setTimeout(() => {
                this.isConfirmLoading = false;
                this.subject.destroy('onCancel');
                this.subject.next(res);
            }, 500);
            
        })
    }

    handleCancel(e){
        this.subject.destroy('onCancel');
    }

    getFormControl(name){
        return this.validateForm.controls[name];
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            reson:['',[this.validatorService.resonValidator]]
        })

        this.reviewFailParams.goodId = this._goodsId;
    }
}
