import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { ClubsService } from '../clubs.service';
import { CodeHelperService } from "../../../core/code-helper.service";



@Component({
	selector: 'clubs-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ClubsListComponent implements OnInit {
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
		private clubsService: ClubsService,
		private router: Router,
		private modalService: NzModalService,
		private codeHelperService: CodeHelperService) {
	}

	_refreshData = () => {
		console.log(1)
		this._loading = true;
		// this.clubsService.getApartmentList(this._params).then(res => {
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
		// this.clubsService.getCubesList(page).then(res=>{
		// 	console.log(res)
		// })

		this._loading = false;
		this._dataSet.dataList = [
			{
			  "id": "3091804935614645248",
			  "num": 1,
			  "imageUrl": "https://img11.360buyimg.com/n7/jfs/t14947/152/2547272843/249018/b643c07c/5aa8c8a8N7cc84d18.jpg",
			  "url": "/index"
			},
			{
			  "id": "3091804942328316928",
			  "num": 2,
			  "imageUrl": "https://img11.360buyimg.com/n7/jfs/t14947/152/2547272843/249018/b643c07c/5aa8c8a8N7cc84d18.jpg",
			  "url": "/index"
			},
			{
			  "id": "3091804942844593152",
			  "num": 3,
			  "imageUrl": "https://img11.360buyimg.com/n7/jfs/t14947/152/2547272843/249018/b643c07c/5aa8c8a8N7cc84d18.jpg",
			  "url": "/index"
			},
			{
			  "id": "3091804943446148096",
			  "num": 4,
			  "imageUrl": "https://img11.360buyimg.com/n7/jfs/t14947/152/2547272843/249018/b643c07c/5aa8c8a8N7cc84d18.jpg",
			  "url": "/index"
			},
			{
			  "id": "3091804943995274240",
			  "num": 5,
			  "imageUrl": "https://img11.360buyimg.com/n7/jfs/t14947/152/2547272843/249018/b643c07c/5aa8c8a8N7cc84d18.jpg",
			  "url": "/index"
			},
			{
			  "id": "3091804944719250432",
			  "num": 6,
			  "imageUrl": "https://img11.360buyimg.com/n7/jfs/t14947/152/2547272843/249018/b643c07c/5aa8c8a8N7cc84d18.jpg",
			  "url": "/index"
			},
			{
			  "id": "3091804945150657536",
			  "num": 7,
			  "imageUrl": "https://img11.360buyimg.com/n7/jfs/t14947/152/2547272843/249018/b643c07c/5aa8c8a8N7cc84d18.jpg",
			  "url": "/index"
			},
			{
			  "id": "3091804946062607360",
			  "num": 8,
			  "imageUrl": "https://img11.360buyimg.com/n7/jfs/t14947/152/2547272843/249018/b643c07c/5aa8c8a8N7cc84d18.jpg",
			  "url": "/index"
			},
			{
			  "id": "3091804946588255232",
			  "num": 9,
			  "imageUrl": "https://img11.360buyimg.com/n7/jfs/t14947/152/2547272843/249018/b643c07c/5aa8c8a8N7cc84d18.jpg",
			  "url": "/index"
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
		this.router.navigate(['/apartment/edit/editModal'])
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
		this.router.navigate(['/clubs/add/add'])


	}

	delete(data){
		// this.clubsService.delete(data).then(res=>{
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
