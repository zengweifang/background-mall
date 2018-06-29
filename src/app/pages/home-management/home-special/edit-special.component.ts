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
	selector: 'edit-special',
	templateUrl: './edit-special.component.html',
	styleUrls: ['./edit-special.component.css']
})
export class EditSpecialComponent implements OnInit {
	validateForm: FormGroup;
	_loading = false;
	_dateRange = [null, null];
	uploadUrl = service.uploadUrl;


	_params = {
		type: 1,
		remark: '',
		title: '',
		index: '0',
		url: '',
		beginTime: null,
		endTime: null,
		imageUrl: null,
		status: '1',
		regions: []
	}
	types=[{id:1,name:'服务'}];

	constructor(
		private fb: FormBuilder,
		private homeManagementService: HomeManagementService,
		private modalService: NzModalService,
		private message: NzMessageService,
		private codeHelperService: CodeHelperService,
		private myLocation: Location,
		private route: ActivatedRoute
	) { }

	itemId = '';

	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			remark: ['', [ Validators.minLength(2), Validators.maxLength(50) ]],
			title: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
			beginTime: [null, [ Validators.required ]],
			endTime: [null, [ Validators.required ]],
			url: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
			index: [0, [Validators.required]],
			_dateRange: [[null, null], [Validators.required]],
			type: [1, [Validators.required]],
		});
		this.itemId = this.route.snapshot.paramMap.get('id');
		this.getSpecialInfo(this.itemId);
		this.getRegions(this.itemId);
	}

	getSpecialInfo(id: string): void {
		this.homeManagementService.getSpecialInfo(id).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this._params = resp.data;
				this._dateRange = [new Date(this._params.beginTime), new Date(this._params.endTime)]
				this.thumbUrlFileList.push({
					uid: -1,
					name: 'xxx.png',
					status: 'done',
					url: this._params.imageUrl,
				})
			} else {
				this.message.create('error', resp.data.message ? resp.data.message : '获取专题信息失败');
			}
		}).catch(err => {
			this._loading = false;
			this.message.create('error', '获取专题信息失败');
		})
	}

	getRegions(id: string): void {
		this.homeManagementService.getSpecialRegions(id).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.nodes = resp.data.regionTreeDTOList;
			} else {
				this.message.create('error', resp.data.message ? resp.data.message : '获取区域失败');
			}
		}).catch(err => {
			this.message.create('error', '获取区域失败');
		})
	}

	push() {

	}

	save(status = 1) {
		// status:1 保存草稿 2 发布
		if (status ===2 && this._dateRange[0] < new Date()) {
			this.message.create('error', '请修改过期时间为当前时间之后');
			return;
		}
		this._params.beginTime = this._dateRange[0];
		this._params.endTime = this._dateRange[0];
		this._params.status = status.toString();
		this._params.index = this._params.index.toString();
		this._params.regions = this.selectedCites;

		this._loading = true;
		this.homeManagementService.updateSpecial(this._params).then(resp => {
			this._loading = false;
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', resp.message || '操作成功');
				this.goback();
			} else {
				this.message.create('error', resp.message || '操作失败');
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
		return this.getFormControl('title').hasError('required') || 
			this.getFormControl('remark').hasError('minlength') ||
			this.getFormControl('remark').hasError('maxlength') ||
			this.getFormControl('url').hasError('required') ||
			!this._params.url || this.selectedCites.length === 0;
	}

	thumbUrlFileList = [];
	previewImage = '';
	previewVisible = false;
	contentGroup = {
		name: '',
		id: '',
	};

	handlePreview = (file: UploadFile) => {
		this.previewImage = file.url || file.thumbUrl;
		this.previewVisible = true;
	}

	imageUpdateStateChange($event) {
		if ($event.file.status === 'removed') {
			this._params.imageUrl = ''
		} else if ($event.file.status === 'done') {
			if ($event.fileList.length > 0) {
				this._params.imageUrl = $event.fileList[0].response.name;
			}
		}
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
