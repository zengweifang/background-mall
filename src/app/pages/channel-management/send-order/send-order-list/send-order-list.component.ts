import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SendOrderService } from '../send-order.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProviderAddModalComponent } from "./provider-add-modal.component";
import { CodeHelperService } from "../../../../core/code-helper.service";
import { getPageParams } from "../../../../core/page.config";

@Component({
	selector: 'send-order-list',
	templateUrl: './send-order-list.component.html',
	styleUrls: ['./send-order-list.component.css']
})
export class SendOrderListComponent implements OnInit {
	validateForm: FormGroup;
	_dataSet = [];
	editRow = null;
	tempEditObject = {};

	_total = 0;
	_loading = true;
	_weights = [{ id: 2, name: '由低到高' }, { id: 1, name: '由高到低' }];
	_params = {
		page: getPageParams(),
		providerName: null,
		cityName: null,
		sort: 1
	}

	constructor(
		private fb: FormBuilder,
		private sendOrderService: SendOrderService,
		private message: NzMessageService,
		private modalService: NzModalService,
		private codeHelperService: CodeHelperService,
	) { }

	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			providerName: ['',],
			cityName: ['',],
			goodsTypeName: ['',],
			sort: [1,],
		});
		// weights:[{id:2,name:'由低到高'},{id:1,name:'由高到低'}],

		this.refreshData();
	}

	/* event response */
	refreshData(reset = false) {
		if (reset) {
			this._params.page.currentPage = 1;
		}
		this._loading = true;
		this.sendOrderService
			.getOrderConfigList(this._params)
			.then(resp => {
				this._loading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._dataSet = resp.data ? resp.data.result : [];
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

	translateNumber(num) {
		let num2 = (num * 100).toString();
		return num2.substring(0, num2.lastIndexOf('.') + 3);
	}

	resetForm($event: MouseEvent) {
		$event.preventDefault();
		this.validateForm.reset();
		this._params.sort = 1;
		for (const key in this.validateForm.controls) {
			this.validateForm.controls[key].markAsPristine();
		}
	}

	search($event: MouseEvent) {
		this.refreshData();
	}

	addResourse() {
		const subscription = this.modalService.open({
			title: '新增供应商',
			content: ProviderAddModalComponent,
			onOk() {
			},
			onCancel() {

			},
			footer: false,
			componentParams: {
			}
		});
		subscription.subscribe(result => {
			if (result === 'onOk') {
				this.refreshData(true);
			}
		})
	}

	edit(data) {
		this.tempEditObject[data.id] = { ...data };
		this.editRow = data.id;
	}

	save(data) {
		// Object.assign(data, this.tempEditObject[data.id]);
		let tempData = this.tempEditObject[data.id];
		this.editRow = null;
		let params = {
			id: tempData.id,
			limitedLine : tempData.limitedLine,
			recommandIndex: tempData.recommandIndex,
			isNew: tempData.isNew,
			quantityIndex: tempData.quantityIndex
		} 
		this.sendOrderService.updateOrderConfig(params).then(resp => {
			this.refreshData(true);
		}).catch(error => {
			this.refreshData(true);
		});
	}

	cancel(data) {
		this.tempEditObject[data.id] = {};
		this.editRow = null;
	}

	delete(item: any) {
		this.sendOrderService.deleteCity([item.id]).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', '删除成功');
				this.refreshData();
			} else {
				this.message.create('error', resp.message ? resp.message : '删除失败');
			}
		}).catch(error => {
			this.message.create('error', '删除失败');
		});
	}
}
