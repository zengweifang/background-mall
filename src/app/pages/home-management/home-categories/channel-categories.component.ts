import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService, UploadFile } from 'ng-zorro-antd';
import { HomeManagementService } from '../home-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodeHelperService } from "../../../core/code-helper.service";
import { config, service } from '../../../core/core.config';
import { getPageParams } from '../../../core/page.config';
import { AddChannelModalComponent } from "../home-categories/add-channel-modal.component";
import { CustomModalService } from '../../../shared/services/custom-modal.service';

@Component({
	selector: 'channel-categories',
	templateUrl: './channel-categories.component.html',
	styleUrls: ['./channel-categories.component.css']
})
export class ChannelCategoriessComponent implements OnInit {
	validateForm: FormGroup;
	_dataSet = [];
	_total = 0;
	_loading = true;

	_params = {
		page: getPageParams(),
		homePageCategoryId: '',
		name: '',
	}

	constructor(
		private fb: FormBuilder,
		private homeManagementService: HomeManagementService,
		private modalService: NzModalService,
		private message: NzMessageService,
		private codeHelperService: CodeHelperService,
		private router: Router,
		private route: ActivatedRoute,
		private customModalService: CustomModalService
	) { }

	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			name: ['', ],
		});

		this._params.homePageCategoryId = this.route.snapshot.paramMap.get('id');

		this.refreshData();
	}

	/* event response */
	refreshData(reset = false) {
		if (reset) {
			this._params.page.currentPage = 1;
		}
		this._loading = true;
		this.homeManagementService
			.getChannelList(this._params)
			.then(resp => {
				this._loading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._dataSet = resp.data ? resp.data.dataList : [];
					this._total = resp.data ? resp.data.page.totalCount : 0;
					this._displayDataChange(this._dataSet);
				} else {
					this.message.create('error', resp.data.message ? resp.data.message : '加载失败');
				}
			}).catch(error => {
				this._loading = false;
				this.message.create('error', '加载失败');
			})
	}

	addNew() {
		const subscription = this.modalService.open({
			title: '添加渠道',
			content: AddChannelModalComponent,
			onOk() {
			},
			onCancel() {

			},
			footer: false,
			componentParams: {
				homePageCategoryId: this._params.homePageCategoryId,
			}
		});
		subscription.subscribe(result => {
			if (result === 'onOk') {
				this.refreshData(true);
			}
		})
	}

	batchDelte(): void {
		let _self = this;
		let ids = this._displayData.filter(item => item.checked).map(x => x.id);
		
		this.customModalService._confirm({
			onOk() {
				_self.deleteRequest(ids);
			}
		});
	}

	delete(item: any) {
		let _self = this; 
		
		this.customModalService._confirm({
			onOk() {
				_self.deleteRequest([item.id]);
			}
		});
	}

	deleteRequest(params: any): void {
		this.homeManagementService.batchRemoveChannelRel(params).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', '操作成功');
				this.refreshData(true);
			} else {
				this.message.create('error', resp.data.message ? resp.data.message : '操作失败');
			}
		}).catch(err => {
			this.message.create('error', '操作失败');
		})
	}

	_allChecked = false;
	_indeterminate = false;
	_displayData = [];

	_displayDataChange($event) {
		this._displayData = $event;
		this._refreshStatus();
	  }
	
	  _refreshStatus() {
		const allChecked = this._displayData.every(value => value.disabled || value.checked) && this._displayData.length > 0;
		const allUnChecked = this._displayData.every(value => value.disabled || !value.checked);
		this._allChecked = allChecked;
		this._indeterminate = (!allChecked) && (!allUnChecked);
	  }
	
	  _checkAll(value) {
		if (value) {
		  this._displayData.forEach(data => {
			if (!data.disabled) {
			  data.checked = true;
			}
		  });
		} else {
		  this._displayData.forEach(data => data.checked = false);
		}
		this._refreshStatus();
	  }

}
