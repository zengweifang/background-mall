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
import { AddCategoriessComponent } from './add-categories.component';


@Component({
	selector: 'edit-categories',
	templateUrl: './edit-categories.component.html',
	styleUrls: ['./edit-categories.component.css']
})
export class EditCategoriessComponent implements OnInit {
	validateForm: FormGroup;
	_dataSet = [];
	_total = 0;
	_loading = true;
	uploadUrl = service.uploadUrl;

	_params = {
		showLeftIndex: true,
		label: '无',
		itemId: '',
		title: '',
		remark: '',
		iconImgUrl: '',
		index: 1,
		contentGroupId: '',
		contentGroupName: '',
		channelIds: [],
		url: null,
		status: 2,
		isDisable: false,
		regionCheckDTOList: []
	}

	selectedLinkType = 1;
	linkContent = '';
	cateId = '';

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
		private fb: FormBuilder,
		private homeManagementService: HomeManagementService,
		private modalService: NzModalService,
		private message: NzMessageService,
		private codeHelperService: CodeHelperService,
		private myLocation: Location,
		private route: ActivatedRoute
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
		this.cateId = this.route.snapshot.paramMap.get('id');
		this.getHomeCategory(this.cateId);	
		this.getRegionList(this.cateId);
	}

	getHomeCategory(id: string) {
		this.homeManagementService.getHomeCategory(id).then(resp => {
			if (resp.resultCode === 200) {
				this._params = resp.data;
				this.contentGroup.id = this._params.contentGroupId || '';
				this.contentGroup.name = this._params.contentGroupName || '';
				this.linkContent = this._params.url || '';
				this.selectedLinkType = this.linkContent.length > 0 ? 1 : 2;
				this.thumbUrlFileList.push({
					uid: -1,
					name: 'xxx.png',
					status: 'done',
					url: this._params.iconImgUrl,
				})
			} else {
				this.message.create('error', resp.message || '获取类目信息失败');
			}
		}).catch(err => {
			this.message.create('error', '获取类目信息失败');
		})
	}

	getRegionList(id: string) {
		this.homeManagementService.getRegionList(id).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.nodes = resp.data.regionTreeDTOList;
			} else {
				this.message.create('error', resp.message || '获取类目信息失败');
			}
		}).catch(err => {
			this.message.create('error', '获取类目信息失败');
		})
	}

	save() {
		if (this.selectedLinkType === 1) {
			this._params.url = this.linkContent;
		} else if (this.selectedLinkType === 2) {
			this._params.contentGroupId = this.contentGroup.id;
			this._params.contentGroupName = this.contentGroup.name;
		}
		this._params.regionCheckDTOList = this.selectedCites;
		this.homeManagementService.updteCategory(this._params).then(resp => {
			if (resp.resultCode === 200) {
				this.message.create('success', resp.message || '操作成功');
				this.myLocation.back();
			} else {
				this.message.create('error', resp.message || '操作失败');
			}
		}).catch(error => {
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

	getSelectedCities(nodes: Array<any>): Array<any> {
		if (!nodes || nodes.length === 0) {
			return [];
		}
		var tmpArr = [];
		nodes.forEach(level1 => {
			if (level1.checked) {
				tmpArr.push({
					id: level1.id,
					level: level1.level
				});
			}
			if ((level1.checked || level1.halfChecked) && level1.hasChildren && level1.children && level1.children.length) {
				var subTmpArr = this.getSelectedCities(level1.children) || [];
				subTmpArr.forEach(level2 => {
					tmpArr.push({
						id: level2.id,
						level: level2.level
					});
				})
			}
		});
		return tmpArr;
	}

	csSelectedCites(ev) {
		this.selectedCites = ev;
	}


}
