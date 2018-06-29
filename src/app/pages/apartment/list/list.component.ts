import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { ApartmentService } from '../apartment.service';
import { CodeHelperService } from "../../../core/code-helper.service";
import { EditApartmentModalComponent } from "../edit/editModal.component";
import { AddApartmentModalComponent } from "../add/addModal.component";



@Component({
	selector: 'client-register',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ApartmentListComponent implements OnInit {
	validateForm: FormGroup;
	_loading = true;
	//列表初始值
	_dataSet = {
		dataList: [],
		page: { totalCount: 0 }
	};

	//列表请求参数
	_params = {
		page: {
			currentPage: 1,
			pageSize: 10
		},
		name: '',
		status: ''
	};

	options = [{id:"",value:"全部"},{id:0,value:"正常"},{id:1,value:"封停"}];

	constructor(private fb: FormBuilder,
		private message: NzMessageService,
		private apartmentService: ApartmentService,
		private router: Router,
		private modalService: NzModalService,
		private codeHelperService: CodeHelperService) {
	}

	_refreshData = () => {
		this._loading = true;
		this.apartmentService.getApartmentList(this._params).then(res => {
			this._loading = false;
			if (res.data) {
				this._dataSet = res.data;
			}
			else {
				this._dataSet = {
					dataList: [],
					page: { totalCount: 0 }
				};
			}
		}, function () {
			this._loading = false;
		})
	};

	filter() {
		this._params.page.currentPage = 1;
		this._refreshData();
	}

	resetForm() {
		this.validateForm.reset();
	}

	toHousing(data) {
		this.router.navigate(['/apartment/housingManagement/housingList/housingList', data.id])
	}

	//编辑查看公寓详情
	toDetailModal(data) {
		const subEditModal = this.modalService.open({
			title: '公寓基本信息',
			content: EditApartmentModalComponent,
			onOk() {
				console.log('click ok')
			},
			onCancel() {
				console.log('click cancel');
			},
			footer: false,
			componentParams: {
				id: data.id
			}
		});
		subEditModal.subscribe(result => {
			if (result.status) {
				if (!this.codeHelperService.isServerError(result)) {
					this._refreshData();
					this.message.create('success', result.message);
				} else {
					this.message.create('error', result.message);
				}
			}
		})
	}

	//新增公寓
	addApartment() {
		// const subAddModal = this.modalService.open({
		// 	title: '新增公寓',
		// 	content: AddApartmentModalComponent,
		// 	onOk() {
		// 		console.log('click ok')
		// 	},
		// 	onCancel() {
		// 		console.log('click cancel');
		// 	},
		// 	footer: false
		// });
		// subAddModal.subscribe(result => {
		// 	if (result.status) {
		// 		if (!this.codeHelperService.isServerError(result)) {
		// 			this._refreshData();
		// 			this.message.create('success', result.message);
		// 		} else {
		// 			this.message.create('error', result.message);
		// 		}
		// 	}

		// })
		this.router.navigate(['/apartment/add/addModal'])


	}

	ngOnInit() {
		this.validateForm = this.fb.group({
			'name': [''],
			'status':['']
		});

		this._refreshData();




	}
}
