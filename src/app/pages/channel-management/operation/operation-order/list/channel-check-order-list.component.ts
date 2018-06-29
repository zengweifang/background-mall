import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { OperationListService } from "../../operation-list.service";
import { CodeHelperService } from "../../../../../core/code-helper.service";
import 'rxjs/Rx';
import { DatePipe } from "@angular/common";
import { HttpClient, HttpRequest } from '@angular/common/http';
import { service } from '../../../../../core/core.config';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { RemarkModalComponent } from "./remark-modal.component";
import { Router } from '@angular/router';

@Component({
    selector: 'app-channel-check-order-list',
    templateUrl: './channel-check-order-list.component.html',
    styleUrls: ['./channel-check-order-list.component.css']
})

export class ChannelCheckOrderListComponent implements OnInit {
    constructor(
        private operationListService: OperationListService,
        private codeHelperService: CodeHelperService,
        private datePipe: DatePipe,
        private message: NzMessageService,
        private modalService: NzModalService,
        private router: Router
    ) { }

    private exportAllOrdersAPI = service.commonService + "/background-manage/managerorder/downloadFilterExcelChannel";
    private exportOrdersAPI = service.commonService + "/background-manage/managerorder/downloadOrderIdExcel";
    
    _dataSet: any = [];

    _current = 1;
    _pageSize = 10;
    _total = 0;
    _loading = true;

    _allChecked = false;
    _disabledButton = true;
    _checkedNumber = 0;
    _displayData: Array<any> = [];
    _exportAll = false;
    _patchExport = false;
    _indeterminate = false;
    @Input()
    set searchFlag(value: any) {
        if (value === '') {
            return;
        }
        this.refreshData(true);
    }

    @Input() deliveryModeType: string;
    @Input() payMethodType: string;
    @Input() channelId: string;
    @Input() orderForm: string;
    @Input() providerName: string;
    @Input() storeName: string;
    @Input() goodsType: string;
    @Input() orderType = '2';
    @Input() goodName = '';
    @Input() orderId = '';
    @Input() payNumber = '';
    @Input() phone = '';
    @Input() startDate: Date;
    @Input() endDate: Date;
    @Input() statusType: number = 12;
    @Input() set exportFlag(value: any) {
        if (value === '') {
            return;
        }
        console.log(value + ' service');
        if (this._isSelected(this._dataSet)) {
            this._patchExportData();
        } else {
            this._exportAllData();
        }
    }
    @Output() isSelectedService = new EventEmitter<boolean>();
    @Output() showError = new EventEmitter<any>();
    _params = {
        "filter": {
            "storeName": "",
            "providerName": "",
            "providerId": "",
            "payNumber": "",
            "orderDataStartStr": "",
            "orderDataEndStr": "",
            "goodName": "",
            "orderId": "",
            "phone": "",
            "payType": "",
            "deliveryMode": "",
            "statusType": 12,
            "orderSource": "",
            "goodsType": "",
            "orderForm": "",
            "orderType": this.orderType,
            "channelId": this.channelId,
        },
        "orderBy": "-create_time",
        "isOnlyForChannel": false,
        "page": {
            "numPerPageOpt": [
                10,
                20,
                50
            ],
            "pageSize": this._pageSize,
            "currentPage": this._current
        }
    }

    ngOnInit() {
        // this.refreshData();
    }

    _displayDataChange($event) {
        // this._dataSet.list = $event;
    };

    _refreshStatus() {
        const allChecked = this._dataSet.every(value => value.checked === true) && this._dataSet.length;
        const allUnChecked = this._dataSet.every(value => !value.checked);
        this._allChecked = allChecked;
        this._indeterminate = (!allChecked) && (!allUnChecked);
        this._disabledButton = !this._dataSet.some(value => value.checked);
        this._checkedNumber = this._dataSet.filter(value => value.checked).length;

        this.isSelectedService.emit(this._isSelected(this._dataSet));
    };

    _isSelected(dataSet) {
        let isSelected = false;
        for (const item in dataSet) {
            if (dataSet.hasOwnProperty(item)) {
                const element = dataSet[item];
                if (element.checked) {
                    isSelected = true;
                    break;
                }
            }
        }
        return isSelected;
    }

    _checkAll(value) {
        if (value) {
            this._dataSet.forEach(data => data.checked = true);
        } else {
            this._dataSet.forEach(data => data.checked = false);
        }
        this._refreshStatus();
    };

    //获取订单列表
    refreshData(reset = false) {
        if (reset) {
            this._current = 1;
        }
        this._loading = true;

        this._configParams();
        this.operationListService.getChannelOrderList(this._params).then(res => {
            this._loading = false;
            if (!this.codeHelperService.isServerError(res)) {
                this._dataSet = res.data ? res.data.list : [];
                this._total = res.data ? res.data.page.totalCount : 0;
                this._refreshStatus();
            } else {
                this.showError.emit(res.message ? res.message : '加载失败');
            }
        }).catch(error => {
            this._loading = false;
            this.showError.emit('加载失败');
        })
    }

    _configParams() {
        if (this.orderType == '1') {
            this._params.filter.deliveryMode = this.deliveryModeType ? this.deliveryModeType : '';
            this._params.filter.payType = this.payMethodType ? this.payMethodType : '';
        }
        this._params.filter.storeName = this.storeName ? this.storeName : '';
        this._params.filter.storeName = this.storeName ? this.storeName : '';
        this._params.filter.providerName = this.providerName ? this.providerName : '';
        this._params.filter.goodsType = this.goodsType ? this.goodsType : '';
        this._params.filter.orderForm = this.orderForm ? this.orderForm : '';
        this._params.filter.channelId = this.channelId ? this.channelId : '';
        this._params.filter.goodName = this.goodName ? this.goodName : '';
        this._params.filter.orderId = this.orderId ? this.orderId : '';
        this._params.filter.payNumber = this.payNumber ? this.payNumber : '';
        this._params.filter.orderType = this.orderType;
        this._params.filter.phone = this.phone ? this.phone : '';
        this._params.filter.orderDataStartStr = this.startDate ? this._transformDateToString(this.startDate) : '';
        this._params.filter.orderDataEndStr = this.endDate ? this._transformDateToString(this.endDate) : '';
        this._params.filter.statusType = this.statusType ? this.statusType : 12;
        this._params.page.currentPage = this._current ? this._current : 1;
        this._params.page.pageSize = this._pageSize ? this._pageSize : 10;
    }

    _transformDateToString(date:Date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }

    //批量导出订单
    _patchExportData() {
        const orderIds = [];
        this._dataSet.forEach(element => {
            element.checked && orderIds.push(element.id);
        });
        if (!orderIds.length) {
            console.log('请先选择');
            return;
        }
        var form1 = document.createElement("form");
        form1.id = "form1";
        form1.name = "form1";
        form1.target = "_blank";
        // form1.enctype = "";
        // 添加到 body 中 
        document.body.appendChild(form1);
        // 创建一个输入 
        var input = document.createElement("input");
        // 设置相应参数 
        input.type = "text";
        input.name = "orderIdReq";
        input.value = JSON.stringify({
            orderIds: orderIds,
            orderType: this.orderType
        });
        // 将该输入框插入到 form 中 
        form1.appendChild(input);
        // form 的提交方式 
        form1.method = "POST";
        // form 提交路径 
        form1.action = this.exportOrdersAPI;
        // 对该 form 执行提交 
        form1.submit();
        // 删除该 form 
        document.body.removeChild(form1);
    }

    //导出全部订单
    _exportAllData() {
        this._configParams();

        var form1 = document.createElement("form");
        form1.id = "form1";
        form1.name = "form1";
        form1.target = "_blank";
        // form1.enctype = "";
        // 添加到 body 中 
        document.body.appendChild(form1);
        // 创建一个输入 
        var input = document.createElement("input");
        // 设置相应参数 
        input.type = "text";
        input.name = "filter";
        input.value = JSON.stringify(this._params.filter);
        // 将该输入框插入到 form 中 
        form1.appendChild(input);
        // 创建一个输入 
        var input2 = document.createElement("input");
        // 设置相应参数 
        input2.type = "text";
        input2.name = "isOnlyForChannel";
        input2.value = '0';
        // 将该输入框插入到 form 中 
        form1.appendChild(input2);
        // form 的提交方式 
        form1.method = "POST";
        // form 提交路径 
        form1.action = this.exportAllOrdersAPI;
        // 对该 form 执行提交 
        form1.submit();
        // 删除该 form 
        document.body.removeChild(form1);

    }

    cateTip = "     ";

	getLatestOrderStatus(item:any) {
		this.operationListService.getLatestOrderStatus(item.mainKeyId).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
                // let tipStr:string = resp.data;
                // let re = /<br>/gi
                // let teststr = tipStr.replace(re, '\n');
                // debugger;
				this.cateTip = resp.data.length ? resp.data : '暂无记录';
			} else {
				this.cateTip="暂无记录";
			}
		}).catch(error => {
			this.message.create('error', '获取失败');
		})
	}

	showRedirectTip($event, item:any) {
		if ($event) {
			this.getLatestOrderStatus(item);
		} else {
			this.cateTip = "     ";
		}
    }



    showRemark(item:any) {
    const subscription = this.modalService.open({
			title: '备注',
			content: RemarkModalComponent,
			onOk() {
			},
			onCancel() {

			},
			footer: false,
			componentParams: {
                customerServiceRemark: item.customerServiceRemark,
                mainKeyId: item.mainKeyId,
			}
		});
		subscription.subscribe(result => {
			if (result === 'onOk') {
				this.refreshData(true);
			}
		})
  }

  goFlowOrderLog(item:any): void {
      this.router.navigate(['/channelManagement/operation/flowOrderLog', item.id, item.mainKeyId, item.channelName, item.goodList[0].goodsTypeId]);
  }
}
