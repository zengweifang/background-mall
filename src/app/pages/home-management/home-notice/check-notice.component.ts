import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService, UploadFile } from 'ng-zorro-antd';
import { HomeManagementService } from '../home-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodeHelperService } from "../../../core/code-helper.service";
import { config, service } from '../../../core/core.config';
import { getPageParams } from '../../../core/page.config';
import { LinkContentModalComponent } from "../home-categories/link-content-modal.component";
import { utils } from "../../../shared/utils/utils";
@Component({
	selector: 'check-notice',
	templateUrl: './check-notice.component.html',
	styleUrls: ['./check-notice.component.css']
})
export class CheckNoticeComponent implements OnInit {
	validateForm: FormGroup;
	_dataSet = [];
	_total = 0;
	_loading = true;
	_dateRange = [null, null];
	noticeId = '';

	_params = {
		content: '',
		summary: '',
		title: '',
		beginTime: null,
		endTime: null
	}

	regionParams = {
		regionRelId: '',
		page: getPageParams()
	}

	constructor(
		private fb: FormBuilder,
		private homeManagementService: HomeManagementService,
		private modalService: NzModalService,
		private message: NzMessageService,
		private codeHelperService: CodeHelperService,
		private route: ActivatedRoute
	) { }

	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			content: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(300) ]],
			summary: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(30) ]],
			title: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
			beginTime: [null, [ Validators.required ]],
			endTime: [null, [ Validators.required ]],
			_dateRange: [[null, null], []]
		});
		this.noticeId = this.route.snapshot.paramMap.get('id');
		this.regionParams.regionRelId = this.noticeId;
		this.getNoticeInfo();
		this.getRegion();
	}

	getRegion(reset = false) {
		if (reset) {
			this.regionParams.page.currentPage = 1;
		}
		this._loading = true;
		this.homeManagementService.getRegion(this.regionParams).then(resp => {
			this._loading = false;
			if (!this.codeHelperService.isServerError(resp)) {
				this._dataSet = resp.data ? resp.data.regions : [];
				this._total = resp.data ? resp.data.page.totalCount : 0;
			} else {
				this.message.create('error', resp.message || '获取公告信息失败');
			}
		}).catch(err => {
			this._loading = false;
			this.message.create('error', '获取公告信息失败');
		})
	}

	getNoticeInfo() {
		this.homeManagementService.getNoticeInfo(this.noticeId).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this._params = resp.data;
				this._dateRange = [utils.formatDateTime(this._params.beginTime, 'yyyy-MM-dd HH:mm:ss'), utils.formatDateTime(this._params.endTime, 'yyyy-MM-dd HH:mm:ss')]
			} else {
				this.message.create('error', resp.message || '获取公告信息失败');
			}
		}).catch(err => {
			this.message.create('error', '获取公告信息失败');
		})
	}

	save() {
		console.log(this._params);
		this._params.beginTime = this._dateRange[0];
		this._params.endTime = this._dateRange[0];
		console.log(this._params);
	}
	  

	getFormControl(key: string) {
		return this.validateForm.controls[key];
	}

	disabledButton(): boolean {
		return !(this._params.title.length > 2 && 
			this._params.summary.length > 0 && 
			this._params.content.length > 0);
	}


}
