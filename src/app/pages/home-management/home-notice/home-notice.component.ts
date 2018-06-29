import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HomeManagementService } from '../home-management.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodeHelperService } from "../../../core/code-helper.service";
import { getPageParams } from '../../../core/page.config';
import { CustomModalService } from '../../../shared/services/custom-modal.service';

@Component({
	selector: 'home-notice',
	templateUrl: './home-notice.component.html',
	styleUrls: ['./home-notice.component.css']
})
export class HomeNoticeComponent implements OnInit {
	validateForm: FormGroup;
	_dataSet = [];
	_total = 0;
	_loading = true;

	_date = null;
  _dateRange = [null, null];

	_params = {
		page: getPageParams(),
		orderBy:"-create_time",
		content: '',
		status: '',
		beginTime: null,
		endTime: null,
	}

	serviceOrderStatuses = [
		{
			statusName: '全部',
			statusType: ''
		},{
			statusName: '已发布',
			statusType: '2'
		},{
			statusName: '草稿',
			statusType: '1'
		},{
			statusName: '进行中',
			statusType: '3'
		},{
			statusName: '已失效',
			statusType: '4'
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
			content: ['', ],
			selectedStatusTypeOption: [null, ],
			_dateRange: [null, []],
		});

		this.refreshData();
	}

	/* event response */
	refreshData(reset = false) {
		if (reset) {
			this._params.page.currentPage = 1;
		}
		this._params.beginTime = this._dateRange[0];
		this._params.endTime = this._dateRange[1];
		this._loading = true;
		this.homeManagementService
			.getNoticeList(this._params)
			.then(resp => {
				this._loading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._dataSet = resp.data ? resp.data.list : [];
					this._total = resp.data ? resp.data.page.totalCount : 0;
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
		this.router.navigate(['noticeManagement/notice/add']);
	}

	check(item: any): void {
		this.router.navigate(['noticeManagement/notice/check', item.id]);
	}

	edit(item: any): void {
		this.router.navigate(['noticeManagement/notice/edit', item.id]);
	}

	invalid(item: any): void {
		let _self = this; 
		
		this.customModalService._confirm({
			onOk() {
				_self.invalidRequest(item.id);
			}
		});
	}

	invalidRequest(id: string): void {
		this.homeManagementService.invalidNotice(id).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', resp.message || '操作成功!');
				this.refreshData();
			} else {
				this.message.create('error', resp.message || '操作失败');
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
		this.homeManagementService.deleteNotice(id).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', resp.message || '删除成功!');
				this.refreshData();
			} else {
				this.message.create('error', resp.message || '删除失败');
			}
		}).catch(err => {
			this.message.create('error', '删除失败');
		})
	}
}
