import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService, UploadFile } from 'ng-zorro-antd';
import { HomeManagementService } from '../home-management.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodeHelperService } from "../../../core/code-helper.service";
import { config, service } from '../../../core/core.config';
import { getPageParams } from '../../../core/page.config';
import { LinkContentModalComponent } from "../home-categories/link-content-modal.component";
import { Location } from '@angular/common';

@Component({
	selector: 'add-notice',
	templateUrl: './add-notice.component.html',
	styleUrls: ['./add-notice.component.css']
})
export class AddNoticeComponent implements OnInit {
	validateForm: FormGroup;
	_dateRange = [null, null];
	_loading = false;

	_params = {
		content: '',
		summary: '',
		title: '',
		beginTime: null,
		endTime: null,
		regions: null,
	}

	constructor(
		private fb: FormBuilder,
		private homeManagementService: HomeManagementService,
		private modalService: NzModalService,
		private message: NzMessageService,
		private codeHelperService: CodeHelperService,
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
	}

	push() {
		this._params.beginTime = this._dateRange[0];
		this._params.endTime = this._dateRange[1];
		this._params.regions = this.selectedCites;
		this._loading = true;
		this.homeManagementService.addNotice(this._params).then(resp => {
			this._loading = false;
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', resp.data.message || '操作成功');
				this.goback();
			} else {
				this.message.create('error', resp.data.message || '操作失败');
			}
		}).catch(err => {
			this._loading = false;
			this.message.create('error', '操作失败');
		})
	}

	save() {
		this._params.beginTime = this._dateRange[0];
		this._params.endTime = this._dateRange[1];
		this._params.regions = this.selectedCites;
		this._loading = true;
		this.homeManagementService.saveDraftNotice(this._params).then(resp => {
			this._loading = false;
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', resp.data.message || '操作成功');
				this.goback();
			} else {
				this.message.create('error', resp.data.message || '操作失败');
			}
		}).catch(err => {
			this._loading = false;
			this.message.create('error', '操作失败');
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
