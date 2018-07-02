import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { BannerService } from '../banner.service';
import { CodeHelperService } from "../../../core/code-helper.service";



@Component({
	selector: 'client-register',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class BannerListComponent implements OnInit {
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
		private bannerService: BannerService,
		private router: Router,
		private modalService: NzModalService,
		private codeHelperService: CodeHelperService) {
	}

	_refreshData = () => {
		console.log(1)
		this._loading = true;
		// this.bannerService.getApartmentList(this._params).then(res => {
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
		// this.bannerService.getBannerList(page).then(res=>{
		// 	console.log(res)
		// })

		this._loading = false;
		this._dataSet.dataList = [
			{
			  "id": "3091807393395212288",
			  "name": "banner2",
			  "imageUrl": "http://bpic.588ku.com/back_pic/03/70/72/5257b6c12d89875.jpg!",
			  "url": "/index",
			  "sort": 1,
			  "description": "banner图测试"
			},
			{
			  "id": "3091804932271473664",
			  "name": "banner图1",
			  "imageUrl": "http://bpic.588ku.com/back_pic/03/70/72/5257b6c12d89875.jpg!r850/fw/800",
			  "url": "/index",
			  "sort": 0,
			  "description": "banner图测试"
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
		// 	content: EditBannerComponent,
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
		this.router.navigate(['/clubs/edit/edit'])
	}

	//新增
	add() {
		// const subAddModal = this.modalService.open({
		// 	title: '新增banner图',
		// 	content: AddBannerComponent,
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

	delete(data){
		// this.bannerService.delete(data).then(res=>{
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
