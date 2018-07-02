import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { CommoditypoolsService } from '../commoditypools.service';
import { CodeHelperService } from "../../../core/code-helper.service";



@Component({
	selector: 'commoditypools-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class CommoditypoolsListComponent implements OnInit {
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
		private CommoditypoolsService: CommoditypoolsService,
		private router: Router,
		private modalService: NzModalService,
		private codeHelperService: CodeHelperService) {
	}

	_refreshData = () => {
		console.log(1)
		this._loading = true;
		// this.CommoditypoolsService.getApartmentList(this._params).then(res => {
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
		// this.CommoditypoolsService.getCubesList(page).then(res=>{
		// 	console.log(res)
		// })

		this._loading = false;
		this._dataSet.dataList = [
			{
			  "name": "珠宝首饰",
			  "pageNum": "111"
			},
			{
			  "name": "钟表",
			  "pageNum": "112"
			},
			{
			  "name": "鞋靴",
			  "pageNum": "113"
			},
			{
			  "name": "手机",
			  "pageNum": "114"
			},
			{
			  "name": "食品饮料",
			  "pageNum": "115"
			},
			{
			  "name": "汽车用品",
			  "pageNum": "116"
			},
			{
			  "name": "母婴",
			  "pageNum": "117"
			},
			{
			  "name": "美妆个护",
			  "pageNum": "118"
			},
			{
			  "name": "酒类",
			  "pageNum": "119"
			},
			{
			  "name": "家用电器",
			  "pageNum": "120"
			},
			{
			  "name": "家具",
			  "pageNum": "121"
			},
			{
			  "name": "服饰内衣",
			  "pageNum": "122"
			},
			{
			  "name": "电脑办公",
			  "pageNum": "123"
			},
			{
			  "name": "厨具",
			  "pageNum": "124"
			},
			{
			  "name": "家装建材",
			  "pageNum": "126"
			},
			{
			  "name": "礼品箱包",
			  "pageNum": "127"
			},
			{
			  "name": "数码",
			  "pageNum": "128"
			},
			{
			  "name": "玩具乐器",
			  "pageNum": "129"
			},
			{
			  "name": "运动户外",
			  "pageNum": "130"
			},
			{
			  "name": "初始",
			  "pageNum": "131"
			},
			{
			  "name": "家居日用",
			  "pageNum": "132"
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
		this.router.navigate(['/commoditypools/edit/edit'])
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
		this.router.navigate(['/commoditypools/add/add'])


	}

	delete(data){
		// this.CommoditypoolsService.delete(data).then(res=>{
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
