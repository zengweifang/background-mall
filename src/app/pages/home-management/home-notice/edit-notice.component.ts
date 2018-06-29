import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService, UploadFile } from 'ng-zorro-antd';
import { HomeManagementService } from '../home-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodeHelperService } from "../../../core/code-helper.service";
import { config, service } from '../../../core/core.config';
import { getPageParams } from '../../../core/page.config';
import { LinkContentModalComponent } from "../home-categories/link-content-modal.component";
import { Location } from '@angular/common';


@Component({
	selector: 'edit-notice',
	templateUrl: './edit-notice.component.html',
	styleUrls: ['./edit-notice.component.css']
})
export class EditNoticeComponent implements OnInit {
	validateForm: FormGroup;
	_loading = false;
	_dateRange = [null, null];
	noticeId = null;

	_params = {
		content: '',
		summary: '',
		title: '',
		beginTime: null,
		endTime: null,
		status:1
	}

	constructor(
		private fb: FormBuilder,
		private homeManagementService: HomeManagementService,
		private modalService: NzModalService,
		private message: NzMessageService,
		private codeHelperService: CodeHelperService,
		private route: ActivatedRoute,
		private myLocation: Location
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
		this.getNoticeInfo();
		this.getRegions(this.noticeId);
	}

	getRegions(id: string): void {
		this.homeManagementService.getReionEdit(id).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.nodes = resp.data.regionTreeDTOList;
			} else {
				this.message.create('error', resp.message || '获取公告信息失败');
			}
		}).catch(err => {
			this.message.create('error', '获取公告信息失败');
		});
	}

	getNoticeInfo() {
		this.homeManagementService.getNoticeInfo(this.noticeId).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this._params = resp.data;
				this._dateRange = [new Date(this._params.beginTime), new Date(this._params.endTime)]
			} else {
				this.message.create('error', resp.message || '获取公告信息失败');
			}
		}).catch(err => {
			this.message.create('error', '获取公告信息失败');
		})
	}

	save(flag=1) {
		// flag:1为保存草稿、2为发布
		this._params.beginTime = this._dateRange[0].getTime();
		this._params.endTime = this._dateRange[0].getTime();
		this._params.status = flag;
		this._loading = true;
		this.homeManagementService.updateNotice(this._params).then(resp => {
			this._loading = false;
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', resp.message || '更新公告信息成功');
				this.goback();
			} else {
				this.message.create('error', resp.message || '更新公告信息失败');
			}
		}).catch(err => {
			this._loading = false;
			this.message.create('error', '更新公告信息失败');
		})
	}

	getFormControl(key: string) {
		return this.validateForm.controls[key];
	}

	disabledButton(): boolean {
		return !(this._params.title.length > 2 && 
			this._params.summary.length > 0 && 
			this._params.content.length > 0 && this.selectedCites.length > 0 && this._dateRange[0] && this._dateRange[1]);
	}

	nodes = [];

	goback() {
		this.myLocation.back();
	}

	selectedCites = [];

	csSelectedCites(ev) {
		this.selectedCites = ev;
	}

}
