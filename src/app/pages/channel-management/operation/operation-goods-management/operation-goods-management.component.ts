import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { OperationListService } from '../operation-list.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CodeHelperService } from "../../../../core/code-helper.service";
import { getPageParams } from "../../../../core/page.config";
import { utils } from '../../../../shared/utils/utils';
import { OperationGoodsImportModalComponent } from "./operation-goods-import-modal.component";
import { OperationGoodsAddModalComponent } from "./operation-goods-add-modal.component";

@Component({
	selector: 'operation-goods-management',
	templateUrl: './operation-goods-management.component.html',
	styleUrls: ['./operation-goods-management.component.css']
})
export class OperationGoodsManagementComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private operationListService: OperationListService,
		private message: NzMessageService,
		private modalService: NzModalService,
		private codeHelperService: CodeHelperService,
		private location: Location,
		private route: ActivatedRoute,
	) { }

	panels = [
		{
			active: false,
			name: '基本信息',
			disabled: false,
			childPanel: [
				{
					active: false,
					name: 'This is panel header 1-1'
				}
			]
		}
	];


	validateForm: FormGroup;
	validateForm2: FormGroup;

	_dataSet = [];
	_virtualDataSet = [];

	editRow = null;
	tempEditObject = {};
	channelId = '';
	channelName = '';

	status = [{ id: 0, name: '关闭' }, { id: 1, name: '待开启' }, { id: 2, name: '开启' }];
	channelInfo = {
		name: '',
		k3id: '',
		type: '',
		customPrice: '',
		appid: '',
		appSecret: '',
		channelAccount: '',
	};

	localChannelInfo = utils.getLocalStorage('channelInfo');
	channelOpenStatus = this.localChannelInfo.status === "开启" ? true : false;

	_total = 0;
	_loading = true;
	_params = {
		page: getPageParams(),
		channelId: '',
		goodsName: '',
		goodsType: '',
		providerName: '',
		isVirtual: 0, // 初始为0   代表真实商品  
	}

	_virtualTotal = 0;
	_virtualLoading = true;

	_virtualGoodsParams = {
		page: getPageParams(),
		channelId: '',
		goodsName: '',
		goodsType: '',
		providerName: '',
		isVirtual: 1,
	}


	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			goodsName: ['',],
			goodsType: ['',],
			providerName: ['',],
		});
		this.validateForm2 = this.fb.group({
			goodsName: ['',],
			goodsType: ['',],
			providerName: ['',],
		});
		this.channelId = this.route.snapshot.paramMap.get('id');
		this.channelName = this.route.snapshot.paramMap.get('name');
		this._params.channelId = this.channelId;
		this._virtualGoodsParams.channelId = this.channelId;
		this.getChannelInfo(this.channelId);
		// this.route.paramMap
		// 	.switchMap((params: ParamMap) =>
		// 		this.pid = params.get('id'));
		this.refreshData();
		this.searchVirtualGoods();
	}

	getChannelInfo(id) {
		this.operationListService.getChannelInfo(id).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.channelInfo = resp.data;
			} else {
				this.message.create('error', resp.message ? resp.message : '渠道信息加载失败');
			}
		}).catch(err => {
			this.message.create('error', '渠道信息加载失败');
		})
	}

	changeStatus() {
		this.operationListService.changeChannelStatus(this.channelId, (this.channelOpenStatus ? 0 : 2)).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.localChannelInfo.status = this.channelOpenStatus ? '开启' : '关闭';
				utils.setLocalStorage('channelInfo', this.localChannelInfo);
				this.message.create('success', '渠道修改状态修改成功');
			} else {
				this.message.create('error', resp.message ? resp.message : '渠道状态修改失败');
			}
		}).catch(err => {
			this.message.create('error', '渠道状态修改失败');
		});
	}

	goBack(): void {
		this.location.back();
	}

	/* event response */
	refreshData(reset = false) {
		if (reset) {
			this._params.page.currentPage = 1;
		}
		this._loading = true;
		this.operationListService
			.getGoodsList(this._params)
			.then(resp => {
				this._loading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._dataSet = resp.data ? resp.data.channelGoodsVOList : [];
					this._total = resp.data ? resp.data.page.totalCount : 0;
				} else {
					this._loading = false;
					this.message.create('error', resp.message ? resp.message : '加载失败');
				}
			}).catch(error => {
				this._loading = false;
				this.message.create('error', '加载失败');
			})
	}

	searchVirtualGoods(reset = false) {
		if (reset) {
			this._virtualGoodsParams.page.currentPage = 1;
		}
		this._virtualLoading = true;
		this.operationListService
			.getGoodsList(this._virtualGoodsParams)
			.then(resp => {
				this._virtualLoading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._virtualDataSet = resp.data ? resp.data.channelGoodsVOList : [];
					this._virtualTotal = resp.data ? resp.data.page.totalCount : 0;
				} else {
					this._virtualLoading = false;
					this.message.create('error', resp.message ? resp.message : '加载失败');
				}
			}).catch(error => {
				this._virtualLoading = false;
				this.message.create('error', '加载失败');
			})
	}

	_allChecked = false;
	_indeterminate = false;

	_virtualAllChecked = false;
	_virtualIndeterminate = false;

	_refreshStatus() {
		const allChecked = this._dataSet.every(value => value.checked === true);
		const allUnChecked = this._dataSet.every(value => !value.checked);
		this._allChecked = allChecked;
		this._indeterminate = (!allChecked) && (!allUnChecked);
	};

	_virtualRefreshStatus() {
		const allChecked = this._virtualDataSet.every(value => value.checked === true);
		const allUnChecked = this._virtualDataSet.every(value => !value.checked);
		this._virtualAllChecked = allChecked;
		this._virtualIndeterminate = (!allChecked) && (!allUnChecked);
	}

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

	_virtualCheckAll(value) {
		if (value) {
			this._virtualDataSet.forEach(data => {
				data.checked = true;
			});
		} else {
			this._virtualDataSet.forEach(data => {
				data.checked = false;
			});
		}
		this._virtualRefreshStatus();
	}

	currentTabIndex = 0;

	selectedTab(index:number) {
		this.currentTabIndex = index;
	}

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

	resetForm2($event: MouseEvent) {
		$event.preventDefault();
		this.validateForm2.reset();
		for (const key in this.validateForm2.controls) {
			this.validateForm2.controls[key].markAsPristine();
		}
	}

	search($event: MouseEvent) {
		this.refreshData(true);
	}

	edit(data) {
		this.tempEditObject[data.id] = { ...data };
		this.editRow = data.id;
	}

	save(data) {
		// Object.assign(data, this.tempEditObject[data.id]);
		let tempData = this.tempEditObject[data.id];
		this.editRow = null;

		const params = {
			id: tempData.id,
			channelPrice: tempData.channelPrice
		}
		this.operationListService.updateChannelGoodsPrice(params).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', '修改成功');
				if (this.currentTabIndex == 0) {
					this.refreshData();
				} else {
					this.searchVirtualGoods();
				}
			} else {
				this.message.create('error', resp.message ? resp.message : '修改成功');
			}
		}).catch(error => {
			this.message.create('error', '修改成功');
		});
	}

	cancel(data) {
		this.tempEditObject[data.id] = {};
		this.editRow = null;
	}

	importGoods() {
		const subscription = this.modalService.open({
			title: '一键导入',
			content: OperationGoodsImportModalComponent,
			onOk() {
			},
			onCancel() {

			},
			footer: false,
			componentParams: {
				channelName: this.channelName,
				channelId: this.channelId,
			}
		});
		subscription.subscribe(result => {
			if (result === 'onOk') {
				// this.refreshData(true);
				console.log('ok');
			}
		})
	}

	addGoods() {
		const subscription = this.modalService.open({
			title: '添加商品',
			content: OperationGoodsAddModalComponent,
			onOk() {
			},
			onCancel() {

			},
			footer: false,
			componentParams: {
				_channelName: this.channelName,
				_channelId: this.channelId,
			},
			width: '800px'
		});
		subscription.subscribe(result => {
			if (result === 'onOk') {
				// this.refreshData(true);
				console.log('ok');
			}
		})
	}

	showDeleteConfirm(dataSet, tabIndex, $event) {
		const _self = this;
		this.modalService.confirm({
			title: '您是否确认要删除这项内容',
			content: '<b>确认删除？</b>',
			onOk() {
				_self.batchDelete(dataSet, tabIndex);
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
				if (tabIndex == 0) {
					this.refreshData();
				} else {
					this.searchVirtualGoods();
				}
			} else {
				this.message.create('error', resp.message ? resp.message : '删除失败');
			}
		}).catch(error => {
			this.message.create('error', '删除失败');
		})
	}

	batchDelete(dataSet, tabIndex) {
		let ids = [];
		dataSet.forEach(data => {
			if (data.checked) {
				ids.push(data.id);
			}
		});
		this.goDelete(ids, tabIndex);
	}

	delete(item: any, tabIndex: number) {
		this.goDelete([item.id], tabIndex);
	}
}
