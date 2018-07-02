import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { BaseService } from '../base.service';
import { CodeHelperService } from "../../../core/code-helper.service";



@Component({
	selector: 'base-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class BaseListComponent implements OnInit {
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
		private BaseService: BaseService,
		private router: Router,
		private modalService: NzModalService,
		private codeHelperService: CodeHelperService) {
	}

	_refreshData = () => {
		console.log(1)
		this._loading = true;
		// this.BaseService.getApartmentList(this._params).then(res => {
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
		// this.BaseService.getCubesList(page).then(res=>{
		// 	console.log(res)
		// })

		this._loading = false;
		this._dataSet.dataList = [
			{
			  "id": 652,
			  "parentId": 0,
			  "name": "数码",
			  "grade": 0
			},
			{
			  "id": 670,
			  "parentId": 0,
			  "name": "电脑、办公",
			  "grade": 0
			},
			{
			  "id": 737,
			  "parentId": 0,
			  "name": "家用电器",
			  "grade": 0
			},
			{
			  "id": 1315,
			  "parentId": 0,
			  "name": "服饰内衣",
			  "grade": 0
			},
			{
			  "id": 1316,
			  "parentId": 0,
			  "name": "美妆护肤",
			  "grade": 0
			},
			{
			  "id": 1318,
			  "parentId": 0,
			  "name": "运动户外",
			  "grade": 0
			},
			{
			  "id": 1319,
			  "parentId": 0,
			  "name": "母婴",
			  "grade": 0
			},
			{
			  "id": 1320,
			  "parentId": 0,
			  "name": "食品饮料",
			  "grade": 0
			},
			{
			  "id": 1620,
			  "parentId": 0,
			  "name": "家居日用",
			  "grade": 0
			},
			{
			  "id": 1672,
			  "parentId": 0,
			  "name": "礼品箱包",
			  "grade": 0
			},
			{
			  "id": 5025,
			  "parentId": 0,
			  "name": "钟表",
			  "grade": 0
			},
			{
			  "id": 6144,
			  "parentId": 0,
			  "name": "珠宝首饰",
			  "grade": 0
			},
			{
			  "id": 6196,
			  "parentId": 0,
			  "name": "厨具",
			  "grade": 0
			},
			{
			  "id": 6233,
			  "parentId": 0,
			  "name": "玩具乐器",
			  "grade": 0
			},
			{
			  "id": 6728,
			  "parentId": 0,
			  "name": "汽车用品",
			  "grade": 0
			},
			{
			  "id": 6994,
			  "parentId": 0,
			  "name": "宠物生活",
			  "grade": 0
			},
			{
			  "id": 9192,
			  "parentId": 0,
			  "name": "医药保健",
			  "grade": 0
			},
			{
			  "id": 9847,
			  "parentId": 0,
			  "name": "家具",
			  "grade": 0
			},
			{
			  "id": 9855,
			  "parentId": 0,
			  "name": "家装建材",
			  "grade": 0
			},
			{
			  "id": 9987,
			  "parentId": 0,
			  "name": "手机",
			  "grade": 0
			},
			{
			  "id": 11729,
			  "parentId": 0,
			  "name": "鞋靴",
			  "grade": 0
			},
			{
			  "id": 12259,
			  "parentId": 0,
			  "name": "酒类",
			  "grade": 0
			},
			{
			  "id": 15248,
			  "parentId": 0,
			  "name": "家纺",
			  "grade": 0
			},
			{
			  "id": 15901,
			  "parentId": 0,
			  "name": "家庭清洁/纸品",
			  "grade": 0
			},
			{
			  "id": 16750,
			  "parentId": 0,
			  "name": "个人护理",
			  "grade": 0
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

	ngOnInit() {
		this.validateForm = this.fb.group({
			'name': [''],
			'status':['']
		});

		this._refreshData();




	}
}
