import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { CategoryService } from '../category.service';
import { CodeHelperService } from "../../../core/code-helper.service";



@Component({
	selector: 'category-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class CategoryListComponent implements OnInit {
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
		private CategoryService: CategoryService,
		private router: Router,
		private modalService: NzModalService,
		private codeHelperService: CodeHelperService) {
	}

	_refreshData = () => {
		console.log(1)
		this._loading = true;
		// this.CategoryService.getApartmentList(this._params).then(res => {
		// 	this._loading = false;
		// 	if (res.data) {
		// 		this._dataSet = res.data;
		// 	}
		// 	else {
		// 		this._dataSet = {
		// 			dataList: [],
		// 			page: { totalCount: 0 }
		// 		};
		// 	}
		// }, function () {
		// 	this._loading = false;
		// })

		// var page={
		// 	pageNum:1,
		// 	pageSize:10
		// }
		// this.CategoryService.getCubesList(page).then(res=>{
		// 	console.log(res)
		// })

		this._loading = false;
		this._dataSet.dataList = [
			{
			  "id": "3091805510658262016",
			  "name": "快消",
			  "sort": 0
			},
			{
			  "id": "3091805514339353600",
			  "name": "美妆",
			  "sort": 1
			},
			{
			  "id": "3091805515135812608",
			  "name": "奢侈品",
			  "sort": 2
			},
			{
			  "id": "3091805515987747840",
			  "name": "运动",
			  "sort": 3
			},
			{
			  "id": "3091805517268009984",
			  "name": "办公",
			  "sort": 4
			}
		  ]
	};

	filter() {
		this._params.page.currentPage = 1;
		this._refreshData();
	}

	resetForm() {
		this.validateForm.reset();
	}

	//编辑查看公寓详情
	edit(data) {
		// const subEditModal = this.modalService.open({
		// 	title: '公寓基本信息',
		// 	content: EditApartmentModalComponent,
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
		// subEditModal.subscribe(result => {
		// 	if (result.status) {
		// 		if (!this.codeHelperService.isServerError(result)) {
		// 			this._refreshData();
		// 			this.message.create('success', result.message);
		// 		} else {
		// 			this.message.create('error', result.message);
		// 		}
		// 	}
		// })
		this.router.navigate(['/category/edit/edit'])
	}

	//新增
	add() {
		// const subAddModal = this.modalService.open({
		// 	title: '新增banner图',
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
		this.router.navigate(['/category/add/add'])


	}

	delete(data){
		// this.CategoryService.delete(data).then(res=>{
		// 	console.log(res)
		// 	this._refreshData();
		// })
		this._refreshData();//test
	}

	ngOnInit() {
		this.validateForm = this.fb.group({
			'name': [''],
			'status':['']
		});

		this._refreshData();




	}
}
