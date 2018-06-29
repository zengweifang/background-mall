import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { OperationListService } from '../operation-list.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodeHelperService } from "../../../../core/code-helper.service";
import { getPageParams } from "../../../../core/page.config";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { service } from '../../../../core/core.config';
import { SecondChannelAddModalComponent } from "./second-channel-add-modal.component";

@Component({
	selector: 'second-channel',
	templateUrl: './second-channel.component.html',
	styleUrls: ['./second-channel.component.css']
})
export class SecondChannelComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private operationListService: OperationListService,
		private message: NzMessageService,
		private modalService: NzModalService,
		private codeHelperService: CodeHelperService,
		private router: Router,
		private route: ActivatedRoute,
	) { }

	validateForm: FormGroup;
	_dataSet = [];
	_total = 0;
	_loading = true;
	_params = {
		page: getPageParams(),
		name: null,
		parentId: '',
	}
	channelId:string;
	channelName:string;

	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			name: ['',],
		});
		this.channelId = this.route.snapshot.paramMap.get('channelId');
		this.channelName = this.route.snapshot.paramMap.get('channelName');
		this._params.parentId = this.channelId;
		this.refreshData();
	}
	
	/* event response */
	refreshData(reset = false) {
		if (reset) {
			this._params.page.currentPage = 1;
		}
		this._loading = true;
		this.operationListService
			.getSecondChannelList(this._params)
			.then(resp => {
				this._loading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._dataSet = resp.data ? resp.data.channelVOList : [];
					this._total = resp.data ? resp.data.page.totalCount : 0;
				} else {
					this._loading = false;
					this.message.create('error', resp.message ? resp.message : '加载失败');
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

	search($event: MouseEvent) {
		this.refreshData();
	}

	isLoadingSyncButton = false;
	syncGoods() {
		this.isLoadingSyncButton = true;
		this.operationListService
		.syncParentChannelGoods(this._params.parentId)
		.then(resp => {
			this.isLoadingSyncButton = false;
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', resp.message ? resp.message : '同步成功');
			} else {
				this.message.create('error', resp.message ? resp.message : '同步失败');
			}
		}).catch(error => {
			this.isLoadingSyncButton = false;
			this.message.create('error', '同步失败');
		})
	}

	iframeObj:any;
	download(url) {
		if (!this.iframeObj) {
			this.iframeObj = document.createElement("iframe");
			this.iframeObj.src = url;
			this.iframeObj.hidden = true;
			document.body.appendChild(this.iframeObj); 
			return;
		}
		this.iframeObj.src = url;
	}

	exportList() {
		const downloadURL = `${service.commonService}/background-manage/channel/exportChild?parentId=${this._params.parentId}&name=${this._params.name}`
		this.download(downloadURL);
	}

	addNew() {
		const subscription = this.modalService.open({
			title: '新增二级渠道',
			content: SecondChannelAddModalComponent,
			onOk() {
			},
			onCancel() {

			},
			footer: false,
			componentParams: {
				channelName: this.channelName,
				channelId: this.channelId,
			}
		});
		subscription.subscribe(result => {
			if (result === 'onOk') {
				this.refreshData(true);
				// console.log('ok');
			}
		})
	}
}
