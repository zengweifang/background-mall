import { Component, Input, OnInit } from "@angular/core";
import { NzModalSubject, NzMessageService, NzModalService } from "ng-zorro-antd";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ApartmentService } from "../../../apartment.service";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { RejectWoComponent } from "../../apartment-wo/modal/reject-wo/reject-wo.component";
import { CodeHelperService } from "../../../../../core/code-helper.service";

@Component({
    selector: 'work-order-modal-component',
    templateUrl: './detail-modal.component.html',
    styleUrls: ['./detail-modal.component.scss']
})

export class WorkOrderDetailModalComponent implements OnInit {
    _id: string;
    _loading=false;
    current = 0;
    isConfirmLoading = false;
    workOrderDetailInfo = {};
    reasons = [{ value: '1', label: '没人服务' }, { value: '2', label: '其他原因' }]
    rejectParams = {};

    constructor(private subject: NzModalSubject,
        private fb: FormBuilder,
        private apartmentService: ApartmentService,
        private activatedRoute: ActivatedRoute,
        private modalService: NzModalService,
        private message: NzMessageService,
        private codeHelperService:CodeHelperService) {
        this.subject.on('onDestrory', () => {
            console.log('destroy');
        })
    }

    getCurrentStatus(orderStatus) {
        switch (orderStatus) {
            case 0:
            case 23:
            case null:
                this.current = 0;
                break;
            case 31:
                this.current = 1;
                break;
            case 425:
                this.current = 2;
                break;
            case 51:
                this.current = 3;
                break;
        }
    }

    getWorkOrderDetail(id) {
        this.apartmentService.getWorkOrderDetail(id).then(res => {
            this.workOrderDetailInfo = res.data;
            this.getCurrentStatus(res.data.orderStatus);
        })
    }

    //取消周期预约
    cancelPeriod(data) {
        this.modalService.confirm({
            title: '确定取消周期预约，取消后将不再根据周期进行自动下单',
            onOk() {
                this.cancelPeriodApi(data);
            },
            onCancel() {
            }
        });
    }
    cancelPeriodApi(data) {
        this._loading = true;
        this.apartmentService.cancelServicePeriod(data.id).then(res => {
            if (!this.codeHelperService.isServerError(res)) {
                this.message.create("success", res.message);
                this.getWorkOrderDetail(this._id);
            }
            this._loading = false;
        })
    }

    //撤销工单
    rejectWorkOrder() {
        const subAddModal = this.modalService.open({
            title: '撤销工单',
            content: RejectWoComponent,
            onOk() {
                console.log('click ok')
            },
            onCancel() {
                console.log('click cancel');
            },
            footer: false
        });
        subAddModal.subscribe(result => {
            if (result.rejectType) {
                result.id = this._id;
                this.apartmentService.rejectWorkOrder(result).then(res => {
                    if (!this.codeHelperService.isServerError(res)) {
                        this.message.create("success", res.message);
                        this.getWorkOrderDetail(this._id);
                    } else {
                        this.message.create("error", res.message);
                    }
                })
            }
        })
    }
    ngOnInit() {
        this._id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getWorkOrderDetail(this._id);
    }
}