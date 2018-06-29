import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HomeManagementService } from '../home-management.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodeHelperService } from "../../../core/code-helper.service";
import { getPageParams } from '../../../core/page.config';
import { CustomModalService } from '../../../shared/services/custom-modal.service';

@Component({
	selector: 'home-categories',
	templateUrl: './home-categories.component.html',
	styleUrls: ['./home-categories.component.css']
})
export class HomeCategoriessComponent implements OnInit {
	validateForm: FormGroup;
	_dataSet = [];
	_total = 0;
	_loading = true;

	_params = {
		page: getPageParams(),
		filter: {
			title: '',
			status: ''
		}
	}

	serviceOrderStatuses = [
		{
			statusName: '全部',
			statusType: ''
		},{
			statusName: '开启中',
			statusType: '1'
		},{
			statusName: '已停用',
			statusType: '2'
		},
	]

	constructor(
		private fb: FormBuilder,
		private homeManagementService: HomeManagementService,
		private modalService: NzModalService,
		private message: NzMessageService,
		private codeHelperService: CodeHelperService,
		private router: Router,
		private customModalService: CustomModalService
	) { }

	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			title: ['', ],
			selectedStatusTypeOption: [null, ]
		});

		this.refreshData();
	}

	/* event response */
	refreshData(reset = false) {
		if (reset) {
			this._params.page.currentPage = 1;
		}
		this._loading = true;
		this.homeManagementService
			.getCategoriesList(this._params)
			.then(resp => {
				this._loading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._dataSet = resp.data ? resp.data : [];
					this._total = resp.page ? resp.page.totalCount : 0;
				} else {
					this.message.create('error', resp.data.message ? resp.data.message : '加载失败');
				}
			}).catch(error => {
				this._loading = false;
				this.message.create('error', '加载失败');
			})
	}

	resetForm($event: MouseEvent) {
		$event.preventDefault();
		this.validateForm.reset();
		for (const key in this.validateForm.controls) {
			this.validateForm.controls[key].markAsPristine();
		}
	}

	addNew() {
		this.router.navigate(['homeManagement/homeCategories/add']);
	}

	toChannel(item: any) {
		this.router.navigate(['homeManagement/homeCategories/channel', item.id]);
	}

	edit(item: any) {
		this.router.navigate(['homeManagement/homeCategories/edit', item.id]);
	}

	stop(item: any) {
		this.homeManagementService.stopHomeCategories(item.id).then(resp => {
			if (resp.resultCode === 200) {
				this.message.create('success', resp.message || '操作成功!');
				this.refreshData();
			} else {
				this.message.create('error', resp.data.message ? resp.data.message : '操作失败');
			}
		}).catch(err => {
			this.message.create('error', '操作失败');
		})
	}

	open(item: any) {
		this.homeManagementService.openHomeCategories(item.id).then(resp => {
			if (resp.resultCode === 200) {
				this.message.create('success', resp.message || '操作成功!');
				this.refreshData();
			} else {
				this.message.create('error', resp.data.message ? resp.data.message : '操作失败');
			}
		}).catch(err => {
			this.message.create('error', '操作失败');
		})
	}

	delete(item: any) {
		let _self = this; 
		
		this.customModalService._confirm({
			onOk() {
				_self.deleteRequest(item.id);
			}
		});
	}

	deleteRequest(id: string): void {
		this.homeManagementService.deleteHomeCategories(id).then(resp => {
			if (resp.resultCode === 200) {
				this.message.create('success', resp.message || '删除成功!');
				this.refreshData();
			} else {
				this.message.create('error', resp.message || '删除失败');
			}
		}).catch(err => {
			this.message.create('error', '删除失败');
		})
	}

	cancel = function () {
		
	};
}
