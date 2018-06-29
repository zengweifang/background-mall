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
	selector: 'add-categories',
	templateUrl: './add-categories.component.html',
	styleUrls: ['./add-categories.component.css']
})
export class AddCategoriessComponent implements OnInit {
	validateForm: FormGroup;
	_loading = false;
	uploadUrl = service.uploadUrl;

	_params = {
		showLeftIndex: true,
		label: '无',
		itemId: '',
		content: '',
		title: '',
		remark: '',
		iconImgUrl: '',
		index: 1,
		contentGroupId: '',
		channelIds: [],
		url: null,
		status: 2,
		isDisable: false,
		regionCheckDTOList: []
	}

	selectedLinkType = 1;
	linkContent = '';

	labels = [
		{
			label : '无'
		},
		{
			label : '热卖'
		},
		{
			label : '新品'
		}
	]

	links = [
		{
			label: '关联内容',
			value: 2
		},
		{
			label: '链接地址',
			value: 1
		}
	]

	constructor(
		public fb: FormBuilder,
		public homeManagementService: HomeManagementService,
		public modalService: NzModalService,
		public message: NzMessageService,
		public codeHelperService: CodeHelperService,
		public myLocation: Location,
		public route: ActivatedRoute
	) { }

	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			title: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(30) ]],
			remark: ['', ],
			label: ['无', [ Validators.required ] ],
			showLeftIndex: [true, [Validators.required]],
			index: [1, [Validators.required]],
			selectedLinkType: [1, []],
			linkContent: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(200)]],
			contentGroup: [{}, []],
		});
	}

	save(status=2) {
		this._loading = true;
		if (this.selectedLinkType === 1) {
			this._params.url = this.linkContent;
		} else if (this.selectedLinkType === 2) {
			this._params.contentGroupId = this.contentGroup.id;
			this._params.content = this.contentGroup.name;
		}
		this._params.status = status;
		this._params.regionCheckDTOList = this.selectedCites;
		this.homeManagementService.insertCategory(this._params).then(resp => {
			this._loading = false;
			if (resp.resultCode === 200) {
				this.message.create('success', resp.message || '操作成功');
				this.myLocation.back();
			} else {
				this.message.create('error', resp.message || '操作失败');
			}
		}).catch(error => {
			this._loading = false;
			this.message.create('error', '操作失败');
		})
	}

	getFormControl(key: string) {
		return this.validateForm.controls[key];
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
			this._params.iconImgUrl = ''
		} else if ($event.file.status === 'done') {
			if ($event.fileList.length > 0) {
				this._params.iconImgUrl = $event.fileList[0].response.name;
			}
		}
	}

	disabledButton(): boolean {
		return !(this._params.title.length > 2 && 
			this._params.iconImgUrl.length > 0 && 
			this._params.index > -1 && 
			((this.linkContent.length > 10) || (
				this.contentGroup.id.length > 0
			)) && this.selectedCites.length > 0);
	}

	showLinkContent() {
		const subscription = this.modalService.open({
			title: '选择内容组',
			content: LinkContentModalComponent,
			onOk() {
			},
			onCancel() {

			},
			footer: false,
			componentParams: {
			}
		});
		subscription.subscribe(result => {
			if (typeof result === 'object') {
				this.contentGroup = result;
			}
		})
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
