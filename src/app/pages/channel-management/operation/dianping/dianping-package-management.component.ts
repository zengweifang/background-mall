import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { OperationListService } from '../operation-list.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CodeHelperService } from "../../../../core/code-helper.service";
import { getPageParams } from "../../../../core/page.config";
import { utils } from '../../../../shared/utils/utils';

@Component({
	selector: 'dianping-package-management',
	templateUrl: './dianping-package-management.component.html',
	styleUrls: ['./dianping-package-management.component.css']
})
export class DianpingPackageManagementComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private operationListService: OperationListService,
		private message: NzMessageService,
		private modalService: NzModalService,
		private codeHelperService: CodeHelperService,
		private location: Location,
		private route: ActivatedRoute,
		private router: Router,
	) { }

	validateForm: FormGroup;

	_dataSet = [];
	channelId = '';
	channelName = '';

	status = [{id:'',name:'全部'},{id:1,name:'上架'},{id:0,name:'下架'}];
	dianpingTypes = [{id:'',name:'全部'},{id:5,name:'保洁'},{id:4,name:'洗衣'},{id:11,name:'家电清洗'}];
	channelInfo = {
		name: '',
		k3id: '',
		type: '',
		customPrice: '',
		appid: '',
		appSecret: '',
		channelAccount: '',
	};

	_total = 0;
	_loading = true;
	_params = {
		page: getPageParams(),
		channelId: '',
		name: '',
		state: '',
		serviceId: '',
	}


	/* lifecycle */
	ngOnInit() {
		this.channelId = this.route.snapshot.paramMap.get('channelId');
		this.channelName = this.route.snapshot.paramMap.get('channelName');
		this._params.channelId = this.channelId;
		this.validateForm = this.fb.group({
			name: ['',],
			state: ['',],
			serviceId: ['',],
		});
		this.refreshData();
	}

	/* event response */
	refreshData(reset = false) {
		if (reset) {
			this._params.page.currentPage = 1;
		}
		this._loading = true;
		let params = this.validateForm.value;
		params.page = getPageParams();
		this.operationListService
			.getDianpingGoodsList(this._params)
			.then(resp => {
				this._loading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._dataSet = resp.data ? resp.data.dataList : [];
					this._total = resp.data ? resp.data.page.totalCount : 0;
					this._refreshStatus();
				} else {
					this._loading = false;
					this.message.create('error', resp.message ? resp.message : '加载失败');
				}
			}).catch(error => {
				this._loading = false;
				this.message.create('error', '加载失败');
			})
	}

	getServiceTypeById(id:number) {
		if (id == 5) {
			return '保洁';
		} else if (id == 4) {
			return '洗衣';
		} else if (id == 11) {
			return '家电清洗';
		} else {
			return '';
		}
	}

	_allChecked = false;
	_indeterminate = false;

	_refreshStatus() {
		const allChecked = this._dataSet.every(value => value.checked === true);
		const allUnChecked = this._dataSet.every(value => !value.checked);
		this._allChecked = allChecked && this._dataSet.length > 0;
		this._indeterminate = (!allChecked) && (!allUnChecked);
	};

	_checkAll(value) {
		if (value) {
			this._dataSet.forEach(data => {
				data.checked = true;
			});
		} else {
			this._dataSet.forEach(data => {
				data.checked = false;
			});
		}
		this._refreshStatus();
	};

	translateNumber(num) {
		let num2 = (num * 100).toString();
		return num2.substring(0, num2.lastIndexOf('.') + 3);
	}

	resetForm($event: MouseEvent) {
		$event.preventDefault();
		this.validateForm.reset();
		for (const key in this.validateForm.controls) {
			this.validateForm.controls[key].markAsPristine();
		}
	}

	search($event: MouseEvent) {
		this.refreshData(true);
	}

	showDeleteConfirm(dataSet, tabIndex, $event) {
		const _self = this;
		this.modalService.confirm({
			title: '您是否确认要删除这项内容',
			content: '<b>确认删除？</b>',
			onOk() {
				// _self.batchDelete(dataSet, tabIndex);
			},
			onCancel() {
			}
		});
	}

	cateTip = "     ";

	getGoodsType(item:any) {
		this.operationListService.getGoodsType(item.goodsTypeId).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.cateTip = resp.data;
			} else {
				this.message.create('error', resp.message ? resp.message : '品类获取失败');
			}
		}).catch(error => {
			this.message.create('error', '品类获取失败');
		})
	}

	showTip($event, item:any) {
		if ($event) {
			this.getGoodsType(item);
		} else {
			this.cateTip = "     ";
		}
	}

	goDelete(ids, tabIndex) {
		this.operationListService.deleteGoodsByIds(ids).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', '删除成功');
				this.refreshData();
			} else {
				this.message.create('error', resp.message ? resp.message : '删除失败');
			}
		}).catch(error => {
			this.message.create('error', '删除失败');
		})
	}

	updateGoodsState(params:any) {
		this.operationListService.updateGoodsState(params).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', '操作成功');
				this.refreshData();
			} else {
				this.message.create('error', resp.message ? resp.message : '操作失败');
			}
		}).catch(error => {
			this.message.create('error', '操作失败');
		})
	}

	batchEditState(dataSet) {
		let ids = [];
		dataSet.forEach(data => {
			if (data.checked) {
				ids.push(data.id);
			}
		});
		this.updateGoodsState({
			ids: ids.join(','),
			state: 0
		});
	}

	editState(item: any) {
		let action = 0;
		if (item.state === '下架') {
			action = 1
		}
		this.updateGoodsState({
			ids: item.id ,
			state: action
		});
	}

	addNew() {
		this.router.navigate(['/channelManagement/operation/dianping/addGoods', this.channelId, this.channelName]);
	}

	edit(data:any) {
		this.router.navigate(['/channelManagement/operation/dianping/editGoods', data.id]);
	}

	check(data:any) {
		this.router.navigate(['/channelManagement/operation/dianping/checkGoods', data.id])
	}

	dianpingEditPackage(data:any) {
		this.router.navigate(['/channelManagement/operation/dianping/editPackage', data.id, this.channelId, this.channelName]);
	}
}
