import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HelpCenterService } from '../help-center.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodeHelperService } from "../../../core/code-helper.service";
import { getPageParams } from "../../../core/page.config";
import * as moment from 'moment';
import { utils } from '../../../shared/utils/utils';
import { CustomModalService } from '../../../shared/services/custom-modal.service';
import { service } from '../../../core/core.config';
import { Location } from '@angular/common';

@Component({
	selector: 'doc-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.css']
})
export class DocEditComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private helpCenterService: HelpCenterService,
		private modalService: NzModalService,
		private message: NzMessageService,
		private codeHelperService: CodeHelperService,
		private router: Router,
		private route: ActivatedRoute,
		private customModalService: CustomModalService,
		private location: Location
	) { }


	docId: string = this.route.snapshot.paramMap.get('id');

	validateForm: FormGroup;
	allUseTarget = [];
	uploadFileURL = service.staticUrl + '/helpdoc-upload';

	detail: any = {};

	fileList: any[] = [];
	ckeditorContent: string = '<p>Some html</p>';

	commitData = {
		id: this.docId ? this.docId : '',
		title: '',
		uploadPeople: window.sessionStorage.getItem('userName'),
		useTarget: '',
		documentDetail: '',
		documentAnnexList: [],
	};

	editorConfig = {

		extraPlugins: 'print,format,font,colorbutton,justify,image2,uploadimage',
		// filebrowserImageBrowseUrl: service.uploadUrl,
		// filebrowserImageBrowseUrl: '/ckfinder/ckfinder.html?type=Images',
		// filebrowserUploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
		filebrowserImageUploadUrl: service.uploadUrl,
		// filebrowserImageUploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images',
		// uploadUrl: service.uploadUrl,
		// uploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
	}

	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			title: ['',],
			uploadPeople: ['',],
			useTarget: [[],],
			ckeditorContent: ['',],
		});
		
		if (this.docId) {
			this.getDetail(this.docId);
		} else {
			this.getUseTarget();
		}
	}

	getDetail(id: string): void {
		this.helpCenterService.getDocDetail(id).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.detail = resp.data;
				this.commitData.documentAnnexList = this.detail.documentAnnexList;
				this.commitData.documentDetail = this.detail.documentDetail;
				this.commitData.uploadPeople = this.detail.uploadPeople;
				this.commitData.title = this.detail.title;
				let tmpFilelist = [];
				this.detail.documentAnnexList && this.detail.documentAnnexList.forEach((item, index) => {
					tmpFilelist.push({
						uid: index,
						name: item.annexName,
						url: service.downUrl + item.annexUrl,
						thumbUrl: service.downUrl + item.annexUrl,
					});
				});
				this.fileList = tmpFilelist;
				this.getUseTarget();
			} else {
				this.message.create('error', resp.message || '文档信息获取失败');
			}
		}).catch(error => {
			this.message.create('error', '文档信息获取失败');
		});
	}

	getUseTarget() {
		this.helpCenterService.getUseTarget().then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.allUseTarget = resp.data;
				this.allUseTarget.forEach(item => {
					item['label'] = item.value;
					if (this.docId) {
						this.detail.useTarget.split(',').forEach(target => {
							if (item.value === target) {
								item['checked'] = true;
							}
						});
					}
				});
				this.docId && this.selectedTarget(this.allUseTarget);
			} else {
				this.message.create('error', resp.message ? resp.message : '获取使用对象失败');
			}
		}).catch(error => {
			this.message.create('error', '获取使用对象失败');
		})
	}

	selectedTarget(value: any[]) {
		let ids = [];
		value.filter(item => {
			return item.checked;
		}).forEach(item => {
			ids.push(item.roleId);
		});
		this.commitData.useTarget = ids.join(',');
	}

	/* event response */
	uploadFileChange($event) {
		if ($event.file.status === 'removed') {
			if ($event.fileList.length === 0) {
				this.commitData.documentAnnexList = [];
			}
		} else if ($event.file.status === 'done' && $event.fileList.length > 0) {
			let annexList = [];
			$event.fileList.forEach(element => {
				annexList.push({
					annexName: element.name,
					annexUrl: element.response.url,
				});
			});
			this.commitData.documentAnnexList = annexList;
		}
	}

	resetForm($event: MouseEvent) {
		this.validateForm.reset();
		for (const key in this.validateForm.controls) {
			this.validateForm.controls[key].markAsPristine();
		}
	}

	submit() {
		this.helpCenterService.saveDoc(this.commitData).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', resp.message || '操作成功');
				this.location.back();
			} else {
				this.message.create('error', resp.message || '操作失败');
			}
		}).catch(error => {
			this.message.create('error', '操作失败');
		});
	}

	onFileUploadRequest($event) {
		var fileLoader = $event.data.fileLoader,
			formData = new FormData(),
			xhr = fileLoader.xhr;

		xhr.open('POST', fileLoader.uploadUrl, true);
		formData.append('file', fileLoader.file, fileLoader.fileName);
		fileLoader.xhr.send(formData);
		$event.stop();
	}
}
