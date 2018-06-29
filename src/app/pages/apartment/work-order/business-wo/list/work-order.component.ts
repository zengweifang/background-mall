import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApartmentService } from "../../../apartment.service";
import { CodeHelperService } from "../../../../../core/code-helper.service";
import { CoreService } from "../../../../../core/core.service";
import { AjaxService } from '../../../../../shared/services/ajax.service';
import { service, config } from '../../../../../core/core.config';
import { WorkOrderDetailModalComponent } from "../detail/detail-modal.component";
import { AddWorkOrderComponent } from "../add/add-work-order.component";
import { CommonService } from "../../../../../shared/services/common.service";
import { SendOrderComponent } from "../../sendOrder/send-order.component";

@Component({
	selector: 'work-order-list',
	templateUrl: './work-order.component.html',
	styleUrls: ['./work-order.component.scss']
})
export class BusinessWoComponent implements OnInit {
	_params = {
		query: { businessIn: false, status: "", startTime: "", endTime: "", address: "" },
		page: {
			currentPage: 1,
			pageSize: 10
		}
	};

	_workOrderCMInfo = {
		dataList: [],
		page: { totalCount: 0 }
	};

	_tabs = [{ id: 1, tabName: '全部' }, { id: 2, tabName: '商务介入' }];
	_statusTypeOptions = [{ value: "", label: '全部' }, { value: "1", label: '待处理' },
	{ value: "2", label: '已处理' }, { value: "3", label: '服务完成' }, { value: "4", label: '已撤回' }];

	_validateForm: FormGroup;
	_startTime = null;
	_endTime = null;
	_loading = false;
	_provinces = [];
	_options: any;
	_areaInfo = [];
	_houseAddr = "";
	_indeterminate = false;
	_disabledButton = true;
	_allChecked = false;
	_checkedNumber = 0;
	_cities = [];
	_scenicspots = [];

	constructor(private fb: FormBuilder,
		private message: NzMessageService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private modalService: NzModalService,
		private apartmentService: ApartmentService,
		private codeHelperService: CodeHelperService,
		private coreService: CoreService,
		private ajaxService: AjaxService,
		private commonService: CommonService) {
	}

	changeDateType(time) {
		return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
	}

	codeAreaInfo(_areaInfo) {
		return _areaInfo && _areaInfo.length != 0 ? _areaInfo.join("") : "";
	}

	codeHouseAddr(_houseAddr) {
		return _houseAddr ? _houseAddr : "";
	}

	_disabledStartDate = (startDate: Date) => {
		if (!startDate || !this._endTime) {
			return startDate && startDate.getTime() > Date.now();
		}
		return startDate && startDate.getTime() > Date.now() || startDate.getTime() >= this._endTime.getTime()
	};

	_disabledEndDate = (endDate: Date) => {
		if (!endDate || !this._startTime) {
			return endDate && endDate.getTime() > Date.now();
		}
		return endDate && endDate.getTime() > Date.now() || endDate.getTime() < this._startTime.getTime();
	};
	//搜索
	search(data) {
		this._params.page.currentPage = 1;
		this._params.query.startTime = this._startTime ? this.changeDateType(this._startTime) + " 00:00:00" : "";
		this._params.query.endTime = this._endTime ? this.changeDateType(this._endTime) + " 59:59:59" : "";
		this._params.query.address = this.codeAreaInfo(this._areaInfo) + this.codeHouseAddr(this._houseAddr);
		this.getWorkOrderList(this._params);
	}
	//重置搜索条件
	resetForm() {
		this._validateForm.reset();
	}
	//切换tab
	tabClick(tab) {
		if (tab.id == 1) {
			this._params.query.businessIn = false;
			this.getWorkOrderList(this._params);
		} else {
			this._params.query.businessIn = true;
			this.getWorkOrderList(this._params);
		}
	}

	//获取选择的items
	getSelItems(data) {
		var idList = [];
		data.forEach(value => {
			if (value.checked) {
				idList.push(value.id);
			}
		});

		return idList;
	}

	//批量下载
	patchExport() {
		var idList = this.getSelItems(this._workOrderCMInfo.dataList);
		var form = document.createElement('form');
		form.id = "form";
		form.name = "form";
		form.target = '_blank';
		form.enctype = 'application/x-www-form-urlencoded';
		document.body.appendChild(form);

		var input = document.createElement('input');//将你请求的数据模仿成一个input表单
		input.type = 'text';
		input.name = 'ids';//该输入框的name
		input.value = JSON.stringify(idList);//该输入框的值

		form.appendChild(input);

		form.method = 'post'; //请求方式
		form.action = service.commonService + '/background-manage/apartment/work-order/batchExport';//请求地址

		form.submit();
		form.remove();
	}

	patchExportAll() {
		var form = document.createElement('form');
		form.id = "form";
		form.name = "form";
		form.target = '_blank';
		document.body.appendChild(form);

		var input = document.createElement('input');//将你请求的数据模仿成一个input表单
		input.type = 'text';
		input.name = 'queryCondition';//该输入框的name
		input.value = JSON.stringify(this._params.query);//该输入框的值
		form.appendChild(input);

		form.method = 'post'; //请求方式
		form.action = service.commonService + '/background-manage/apartment/work-order/exportAll';//请求地址

		form.submit();
		form.remove();
	}

	_refreshStatus() {
		const allChecked = this._workOrderCMInfo.dataList.every(value => value.checked === true);
		const allUnChecked = this._workOrderCMInfo.dataList.every(value => !value.checked);
		this._allChecked = allChecked;
		this._indeterminate = (!allChecked) && (!allUnChecked);
		this._disabledButton = !this._workOrderCMInfo.dataList.some(value => value.checked);
		this._checkedNumber = this._workOrderCMInfo.dataList.filter(value => value.checked).length;
	}

	_checkAll(value) {
		if (value) {
			this._workOrderCMInfo.dataList.forEach(data => data.checked = true);
		} else {
			this._workOrderCMInfo.dataList.forEach(data => data.checked = false);
		}
		this._refreshStatus();
	}

	//to详情
	goDetail(data) {
		console.log(data)
		this.router.navigate(['businessWo/detail-modal/detail-modal',data.id]);
		// const subWorkOrderDetailModal = this.modalService.open({
		// 	title: '订单详情',
		// 	content: WorkOrderDetailModalComponent,
		// 	onOk() {
		// 		console.log('click ok')
		// 	},
		// 	onCancel() {
		// 		console.log('click cancel');
		// 	},
		// 	footer: false,
		// 	componentParams: {
		// 		id: data.id
		// 	}
		// });
		// subWorkOrderDetailModal.subscribe(result => {
		// 	if (result.status) {
		// 		if (!this.codeHelperService.isServerError(result)) {
		// 			this.getWorkOrderList(this._params);
		// 			this.message.create('success', result.message);
		// 		} else {
		// 			this.message.create('error', result.message);
		// 		}
		// 	}

		// })
	}

	addWorkOrder() {
		this.router.navigate(['business/add/add']);
	}

	select(data) {
		var label = [];
		if (data.index == 2) {
			label.push(data.option.label);
			label.unshift(data.option.parent.label);
			label.unshift(data.option.parent.parent.label)
		}
		this._areaInfo = label;
	}

	loadData(e: { option: any, index: number, resolve: Function, reject: Function }): void {
		if (e.index === -1) {
			this.commonService.getAllRegion({}).then(res => {
				this._provinces = res.data;
				e.resolve(this._provinces);
			})
			return;
		}

		const option = e.option;
		option.loading = true;
		if (e.index === 0) {
			this.commonService.getAllRegion({ parentId: option.id }).then(res => {
				option.loading = false;
				this._cities = res.data;
				e.resolve(this._cities);
			})
		}
		if (e.index === 1) {
			this.commonService.getAllRegion({ parentId: option.id }).then(res => {
				option.loading = false;
				this._scenicspots = res.data;
				this._scenicspots.forEach(element => {
					element.isLeaf = true;
				});
				e.resolve(this._scenicspots);
			})
		}
	}

	//跳转派单页面
	sendOrder(data, type) {
		var ids = [];
		var flag = true;
		if (type === 'alone') {
			ids.push(data.id);
		} else {
			this._workOrderCMInfo.dataList.forEach(i => {
				if (i.checked == true) {
					ids.push(i.id);
					if (this._workOrderCMInfo.dataList[0].goodsTypeId != i.goodsTypeId) {//判断是否是同一品类
						flag = false;
					}
				}
			})
		}

		if(flag){
			this.router.navigate(['sendOrder', JSON.stringify(ids)]);
		}else{
			this.message.create("warning","请选择同一品类服务进行批量派单！");
		}
		
	}

	getWorkOrderList(params) {
		this._loading = true;
		this.apartmentService.getWorkOrderList(params).then(res => {
			if (!this.codeHelperService.isServerError(res)) {
				if (res.data.dataList) {
					this._workOrderCMInfo = res.data;
				} else {
					this._workOrderCMInfo = {
						dataList: [],
						page: {
							totalCount: 0
						}
					};
				}
				this._refreshStatus();
			}
			this._loading = false;
		})
	}

	ngOnInit() {
		this._validateForm = this.fb.group({
			number: [''],
			categoryName: [''],
			apartmentName: [''],
			houseAddr: [''],
			status: [''],
			areaInfo: [null],
			startTime: [null],
			endTime: [null]
		})

		//初始化
		this.getWorkOrderList(this._params);

	}
}
