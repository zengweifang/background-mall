import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CodeHelperService } from "../../../core/code-helper.service";

import { GoodsReviewService } from "../goods.service";
import { CommonService } from "../../../shared/services/common.service";

@Component({
	selector: 'goods-review-list',
	templateUrl: './review.component.html',
	styleUrls: ['./review.component.scss']
})
export class GoodsReviewListComponent implements OnInit {
	_validateForm : FormGroup;
	_loading = false;
	_reviewLoading = false;
	_allChecked = false;
	_indeterminate = false;
	_disabledButton = false;
	_checkedNumber = 0;
	_goodsTypeText = "";
	_reviewParams={
		page: {currentPage:1,pageSize:10},
		status: 11,
		submitStartedDate:null, 
		submitEndDate:null
	}
	_submitBatchRevParams = { ids: [], reviewerId: sessionStorage.getItem('userId')};
	previewVisible=false;
	_tabs = [{ id: 11, 'name': '待审核' },
	{ id: 13, name: '审核通过' },
	{ id: 12, name: '未通过'}]

	_goodsResult = {
		goods:[],
		page:{totalCount:0}
	};
	constructor(private fb: FormBuilder,
		private message: NzMessageService,
		private goodsReviewService:GoodsReviewService,
		private codeHelperService:CodeHelperService,
		private commonService:CommonService,
		private router:Router,
		private modalService:NzModalService) {
	}

	_refreshStatus() {
		const allChecked = this._goodsResult.goods.every(value => value.checked === true);
		const allUnChecked = this._goodsResult.goods.every(value => !value.checked);
		this._allChecked = allChecked;
		this._indeterminate = (!allChecked) && (!allUnChecked);
		this._disabledButton = !this._goodsResult.goods.some(value => value.checked);
		this._checkedNumber = this._goodsResult.goods.filter(value => value.checked).length;
	}

	_checkAll(value) {
		if (value) {
			this._goodsResult.goods.forEach(data => data.checked = true);
		} else {
			this._goodsResult.goods.forEach(data => data.checked = false);
		}
		this._refreshStatus();
	}

	tabClick(tab){
		this._reviewParams.status = tab.id;
		this.goodsReview(this._reviewParams);
	}

	_cancel(){
		this.message.info("操作取消");
	}

	search(){
		this._reviewParams.page.currentPage = 1;
		this.goodsReview(this._reviewParams);
	}

	_disabledStartDate = (startValue) => {
		var currentTime = new Date();
		if (startValue.getTime() > currentTime.getTime()) {
			return true;
		}
		if (!startValue || !this._reviewParams.submitEndDate) {
			return false;
		}
		return startValue.getTime() >= this._reviewParams.submitEndDate.getTime();
	};

	_disabledEndDate = (endValue) => {
		var currentTime = new Date();
		if (endValue && endValue.getTime() > currentTime.getTime()) {
			return true;
		}
		if (!endValue || !this._reviewParams.submitStartedDate) {
			return false;
		}
		return endValue.getTime() < this._reviewParams.submitStartedDate.getTime();
	};

	//重置搜索条件
	resetForm() {
		this._validateForm.reset();
	}

	getGoodsType(data){
		console.log(data)
		this.commonService.getGoodsType(data.goodTypeId).then(res=>{
			console.log(res)
			this._goodsTypeText = res.data;
		})
	}
	
	batchReview(){
		var self = this;
		this.modalService.confirm({
			title: '您是否确认要批量审核通过？',
			onOk() {
				self.bchReview();
			},
			onCancel() {
			}
		});
	}

	bchReview(){
		this._submitBatchRevParams.ids = [];
		this._goodsResult.goods.forEach(item=>{
			if(item.checked){
				this._submitBatchRevParams.ids.push(item.id);
			}
		})
		this._reviewLoading = true;
		this.goodsReviewService.batchReview(this._submitBatchRevParams).then(res=>{
			this._reviewLoading = false;
			if(!this.codeHelperService.isServerError(res)){
				this.message.create('success',res.message);
				this.goodsReview(this._reviewParams);
				this._refreshStatus();
			}else{
				this.message.create('error',res.message);
			}
		})
	}

	goodsReview(data){
		this._loading = true;
		this.goodsReviewService.goodsReview(data).then(res=>{
			this._loading = false;
			this._goodsResult = res.data;
			this._refreshStatus();
		})
	}

	review(data){
		this.router.navigate(['goods/review-detail',data.id])
	}

	ngOnInit() {
		this._validateForm = this.fb.group({
			providerName: ['', [Validators.required]],
			typeName: ['', [Validators.required]],
			goodName: ['', [Validators.required]],
			submitStartedDate:[null],
			submitEndDate:[null]
		});
		this.goodsReview(this._reviewParams);
	}
}
