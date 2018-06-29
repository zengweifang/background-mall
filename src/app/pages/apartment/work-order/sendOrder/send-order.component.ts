import { Component, Input, OnInit } from "@angular/core";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ApartmentService } from "../../apartment.service";
import { ValidatorService } from "../../../../core/validator.service";
import { CodeHelperService } from "../../../../core/code-helper.service";

@Component({
    selector: 'work-order-component',
    templateUrl: './send-order.component.html',
    styleUrls: ['./send-order.component.scss', '../../../../app.component.scss']
})

export class SendOrderComponent implements OnInit {
    validateForm: FormGroup;
    _ids = [];
    _orderDetail = [];
    editRow = null;
    goodsObj = null;
    _loading = false;
    _submitLoading = false;
    _goodsRelLoading = false;
    _params = { channelId: "", goodsId: "", storeId: "", page: { currentPage: 1, pageSize: 10 } };
    _goodsRel = { dataList: [], page: { totalCount: 0 } };
    _submitParams = {
        providerId: "",
        storeId: "",
        goodsId: ""

    }

    text = "公区保洁、单周保洁、双周保洁取公区数为数量，开荒保洁取套内面积为数量，甲醛治理取建筑面积为数量，甲醛检测取房间数，消杀保洁按房源套数，其他品类均取自定义数量。"

    constructor(private message: NzMessageService,
        private fb: FormBuilder,
        private apartmentService: ApartmentService,
        private validatorService: ValidatorService,
        private codeHelperService: CodeHelperService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private modalService: NzModalService) {
    }

    //获取订单ids
    getWorkOrderItemList = function (data) {
        this._submitParams.workOrderItemList = [];
        data.forEach(e => {
            var obj = {
                customNumber: e.customCount,
                id: e.id
            }
            this._submitParams.workOrderItemList.push(obj);
        })
    }

    search() {
        this.listGoodsRelByPage(this._params);
    }

    reset(array) {
        array.forEach(item => {
            item.value = false;
        });
        this.search();
    }

    //获取订单列表
    preSenderOrder(ids) {
        this._loading = true;
        this.apartmentService.preSenderOrder(ids).then(res => {
            this._loading = false;
            if (!this.codeHelperService.isServerError(res)) {
                this._orderDetail = res.data;
                this._params = {
                    channelId: res.data[0].channelId,
                    goodsId: res.data[0].goodsId,
                    storeId: res.data[0].storeId,
                    page: { currentPage: 1, pageSize: 10 }
                }
                this.listGoodsRelByPage(this._params);//获取可选供应商

                this._orderDetail.forEach((e,i) => {
                    this.validateForm.addControl(`customCount_${i}`, new FormControl(0, [this.validatorService.customCountValidator]))
                });
                console.log(this.validateForm)
            } else {
                this._orderDetail = [];
            }
        })
    }

    //获取可选供应商列表
    listGoodsRelByPage(data) {
        this._goodsRelLoading = true;
        this.apartmentService.listGoodsRelByPage(data).then(res => {
            this._goodsRelLoading = false;
            if (!this.codeHelperService.isServerError(res) && res.data.dataList) {
                this._goodsRel = res.data;
            } else {
                this._goodsRel = { dataList: [], page: { totalCount: 0 } };
            }

        })
    }

    //派单二次确认
    senderOrder() {
        var self = this;
        this.modalService.confirm({
            title: '您是否确认派单？',
            onOk() {
                self.sorder();//派单
            },
            onCancel() {
            }
        });

    }

    selectedRadio(data){
        var node = document.getElementById(data.id);
        var inputNode = node.getElementsByTagName('input');
        inputNode[0].click();
    }

    //派单
    sorder() {
        this._submitParams.providerId = this.goodsObj.providerId;
        this._submitParams.storeId = this.goodsObj.storeId;
        this._submitParams.goodsId = this.goodsObj.goodsId;
        this.getWorkOrderItemList(this._orderDetail);
        this._submitLoading = true;
        this.apartmentService.senderOrder(this._submitParams).then(res => {
            if (!this.codeHelperService.isServerError(res)) {
                this._submitLoading = false;
                this.router.navigate(['business/list/list']);
                this.message.create('success', res.message);
            } else {
                this.message.create('error', res.message);
            }

        })
    }

    //返回工单列表
    handleCancel() {
        this.router.navigate(['business/list/list']);
    }

    cancel(data) {
        data.editRow = false;
    }

    getFormControl(name) {
        return this.validateForm.controls[name];
    }
    ngOnInit() {
        this.validateForm = this.fb.group({
            userName: ["", [Validators.required]],
            phone: ["", [this.validatorService.phoneValidator]],
            providerName: [""],
            storeName: [""],
            goodsName: [""],
            goodsObj: [null]
        })

        this._ids = JSON.parse(this.activatedRoute.snapshot.paramMap.get('ids'));
        this.preSenderOrder(this._ids);//获取订单

    }
}