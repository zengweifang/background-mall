import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { OperationListService } from '../operation-list.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodeHelperService } from "../../../../core/code-helper.service";
import { getPageParams } from "../../../../core/page.config";

@Component({
	selector: 'operation-list',
	templateUrl: './operation-list.component.html',
	styleUrls: ['./operation-list.component.css']
})
export class OperationListComponent implements OnInit {
	validateForm: FormGroup;
	_dataSet = [];

	status = [{id:0,name:'关闭'},{id:1,name:'待开启'},{id:2,name:'开启'}];

	_total = 0;
	_loading = true;
	_params = {
		page: getPageParams(),
		name: null,
		status: 2
	}

	constructor(
		private fb: FormBuilder,
		private operationListService: OperationListService,
		private message: NzMessageService,
		private modalService: NzModalService,
		private codeHelperService: CodeHelperService,
		private router: Router,
	) { }

	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			name: ['',],
			status: [2,],
		});
		this.refreshData();
	}

	/* event response */
	refreshData(reset = false) {
		if (reset) {
			this._params.page.currentPage = 1;
		}
		this._loading = true;
		this.operationListService
			.getChannelList(this._params)
			.then(resp => {
				this._loading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._dataSet = resp.data ? resp.data.channelVOList : [];
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
		for (const key in this.validateForm.controls) {
			this.validateForm.controls[key].markAsPristine();
		}
	}

	search($event: MouseEvent) {
		this.refreshData();
	}

	delete(item: any) {
		this.operationListService.deleteCity([item.id]).then(resp => {
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

	toGoodsManagement(item: any) {
		this.operationListService.saveChannelInfo(item);
		this.router.navigate(['/channelManagement/operation/operationGoodsManagement', item.id, item.name]);
	}

	toOrderManagement(item: any) {
		this.router.navigate(['/channelManagement/operation/operationOrders', item.id, item.name]);
	}

	toSecondChannel(item:any) {
		this.router.navigate(['/channelManagement/operation/secondChannel', item.id, item.name]);
	}

	toPackageManagement(item:any) {
		this.router.navigate(['/channelManagement/operation/dianping', item.id, item.name]);
	}
}
