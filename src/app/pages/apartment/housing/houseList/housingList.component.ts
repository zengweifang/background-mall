import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { service, config } from '../../../../core/core.config';
import { ApartmentService } from '../../apartment.service';
import { CodeHelperService } from "../../../../core/code-helper.service";

import { HouseAddModalComponent } from "../houseAdd/houseAddModal.component";
import { HouseEditModalComponent } from "../houseEdit/houseEditModal.component";
import { FileUploader } from "ng2-file-upload";

@Component({
	selector: 'client-register',
	templateUrl: './housingList.component.html',
	styleUrls: ['./housingList.component.css']
})
export class HousingListComponent implements OnInit {
	validateForm: FormGroup;
	_loading = true;
	userId = sessionStorage.getItem("userId");

	_allChecked = false;
	_disabledButton = true;
	_checkedNumber = 0;
	_displayData: Array<any> = [];
	_operating = false;
	_indeterminate = false;
	_importOperating = false;
	uploader = new FileUploader({});
	files: any[] = [];
	options = [{ id: '全部', label: '全部' }, { id: 'yunding', label: '云丁' }, { id: '', label: '无' }]
	// _dateRange = [null,null];

	time = {
		utcTime: {
			_dateRange: [null, null]
		},
		changeDateType(time) {
			return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
		}
	}

	getNearDayApi(days) {
		var today = new Date(),
			todayMils = today.getTime(),
			startTimeMils = todayMils - days * 24 * 60 * 60 * 1000;
		return {
			// startDate:,
			// endDate:today
			_dateRange: [new Date(startTimeMils), today]
		}
	}

	//格式化时间
	getNearDay(days) {
		this.time.utcTime = this.getNearDayApi(days);
		this.changeDateCall();
	}
	changeDateCall() {
		console.log(this.time.utcTime)
		if (this.time.utcTime._dateRange) {
			this._params.createStartTime = this.time.utcTime._dateRange[0] ? this.time.changeDateType(this.time.utcTime._dateRange[0]) + " 00:00:00" : '';
			this._params.createEndTime = this.time.utcTime._dateRange[1] ? this.time.changeDateType(this.time.utcTime._dateRange[1]) + " 23:59:59" : '';
		}
	}

	//列表初始值
	_dataSet = {
		data: [],
		page: { totalCount: 0 }
	};

	//列表请求参数
	_params = {
		apartmentId: '',
		page: {
			currentPage: 1,
			pageSize: 10
		},
		address: '',
		resourceCode: '',
		createStartTime: null,
		createEndTime: null
	};

	_refreshStatus() {
		const allChecked = this._dataSet.data.every(value => value.checked === true);
		const allUnChecked = this._dataSet.data.every(value => !value.checked);
		this._allChecked = allChecked;
		this._indeterminate = (!allChecked) && (!allUnChecked);
		this._disabledButton = !this._dataSet.data.some(value => value.checked);
		this._checkedNumber = this._dataSet.data.filter(value => value.checked).length;
	}

	_checkAll(value) {
		if (value) {
			this._dataSet.data.forEach(data => data.checked = true);
		} else {
			this._dataSet.data.forEach(data => data.checked = false);
		}
		this._refreshStatus();
	}

	_cancel = function () {
		this.message.info("操作取消");
	}

	constructor(private fb: FormBuilder,
		private message: NzMessageService,
		private apartmentService: ApartmentService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private modalService: NzModalService,
		private codeHelperService: CodeHelperService) {

		this.activatedRoute.paramMap
			.switchMap((params: ParamMap) => this._params.apartmentId = params.get('id') ? params.get('id') : this.userId)
			.subscribe()

		this._refreshData(this._params);
		//初始化上传文件对象
		this.uploader = new FileUploader({
			url: service.commonService + '/background-manage/apartmentResource/import?apartmentId=' + this._params.apartmentId,
			method: "POST",
			allowedFileType: ['xls'],
			removeAfterUpload: true,
			autoUpload: true//自动上传
		});

		this.uploader.onAfterAddingFile = (f) => {
			this._importOperating = true;
			this.uploader.queue[0].onSuccess = (response, status, headers) => {
				let tempRes = JSON.parse(response);
				// 上传文件成功   
				if (status == 200) {
					// 上传文件后获取服务器返回的数据
					setTimeout(() => {
						this._refreshData(this._params);
						this.message.create('success', tempRes.message);
						this._importOperating = false;
					}, 3000);
				} else {
					this.message.create('error', tempRes.message);
					this._importOperating = false;
					// 上传文件后获取服务器返回的数据错误        
				}
			};

			return f;
		};
	}

	_refreshData = (params) => {
		this._loading = true;
		this.apartmentService.getHousingList(params).then(res => {
			this._loading = false;
			if (res.data) {
				this._dataSet = res;
			}
			else {
				this._dataSet = {
					data: [],
					page: { totalCount: 0 }
				};
			}
		}, function () {
			this._loading = false;
		})
	};

	//搜索
	filter() {
		this._refreshData(this._params);
	}

	//清除条件
	resetForm() {
		this.validateForm.reset();
		delete this._params.createStartTime;
		delete this._params.createEndTime;
	}

	delete(flag, item) {
		var idList = [];
		if (flag == 1) {
			idList.push(item);
		} else if (flag == 2) {
			this._dataSet.data.forEach(value => {
				if (value.checked) {
					idList.push(value.id);
				}
			});
		};
		this._operating = true;
		this.apartmentService.deleteHousing(idList).then(res => {
			if (!this.codeHelperService.isServerError(res)) {
				this._dataSet.data.forEach(value => value.checked = false);
				this._refreshStatus();
				this._params.page.currentPage = 1;
				this._refreshData(this._params);
				this.message.create('success', res.message);
			} else {
				this.message.create('error', res.message);
			}
			this._operating = false;
		}, function () {
			this._operating = false;
		})
	}


	//删除房源
	_deleteHousing(flag, item) {
		var self = this;
		this.modalService.confirm({
			title: '您是否确认要删除这项内容',
			onOk() {
				self.delete(flag, item);
			},
			onCancel() {
			}
		});
	}
	//新增房源
	addHousing() {
		const subAddHouseModal = this.modalService.open({
			title: '新增房源',
			content: HouseAddModalComponent,
			onOk() {
				console.log('click ok')
			},
			onCancel() {
				console.log('click cancel');
			},
			footer: false,
			componentParams: {
				apartmentId: this._params.apartmentId
			}
		});
		subAddHouseModal.subscribe(result => {
			if (result.status) {
				if (!this.codeHelperService.isServerError(result)) {
					this._refreshData(this._params);
					this.message.create('success', result.message);
				} else {
					this.message.create('error', result.message);
				}
			}

		})
	}

	//编辑房源
	toHousing(data) {
		const subEditHouseModal = this.modalService.open({
			title: '房源基本信息',
			content: HouseEditModalComponent,
			onOk() {
				console.log('click ok')
			},
			onCancel() {
				console.log('click cancel');
			},
			footer: false,
			componentParams: {
				apartmentId: this._params.apartmentId,
				id: data.id
			}
		});
		subEditHouseModal.subscribe(result => {
			if (result.status) {
				if (!this.codeHelperService.isServerError(result)) {
					this._refreshData(this._params);
					this.message.create('success', result.message);
				} else {
					this.message.create('error', result.message);
				}
			}

		})
	}
	ngOnInit() {
		this.validateForm = this.fb.group({
			'address': [''],
			'resourceCode': [''],
			'rangDate': [[null, null]],
			'lockCode': ['全部']
		});
	}
}
