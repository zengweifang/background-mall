import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { OauthRegisterService } from '../oauth-register.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientRegisterAddModalComponent } from "./client-register-add-modal.component";
import { ClientRegisterUpdateModalComponent } from "./client-register-update-modal.component";
import { CodeHelperService } from "../../../core/code-helper.service";

@Component({
	selector: 'client-register',
	templateUrl: './client-register.component.html',
	styleUrls: ['./client-register.component.css']
})
export class ClientRegisterComponent implements OnInit {
	validateForm: FormGroup;
	_dataSet = [];

	_current = 1;
	_pageSize = 10;
	_total = 0;
	_loading = true;

	constructor(
		private fb: FormBuilder,
		private oauthRegisterService: OauthRegisterService,
		private modalService: NzModalService,
		private message: NzMessageService,
		private codeHelperService: CodeHelperService,
	) { }

	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			name: ['', [Validators.required]]
		});

		this.refreshData();
	}

	/* event response */
	refreshData(reset = false) {
		if (reset) {
			this._current = 1;
		}
		this._loading = true;
		this.oauthRegisterService
			.getOAuthClientList(this._current, this._pageSize, this.validateForm.controls['name'].value)
			.then(resp => {
				this._loading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._dataSet = resp.data ? resp.data.list : [];
					this._total = resp.data ? resp.data.total : 0;
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

	search($event: MouseEvent) {
		for (const i in this.validateForm.controls) {
			this.validateForm.controls[i].markAsDirty();
		}
		this.refreshData();
	}

	addClient() {
		const subscription = this.modalService.open({
			title: '注册',
			content: ClientRegisterAddModalComponent,
			onOk() {
			},
			onCancel() {

			},
			footer: false,
			componentParams: {
			}
		});
		subscription.subscribe(result => {
			if (result === 'onOk') {
				this.refreshData(true);
			}
		})
	}

	detaiClient(item: any) {
		const subscription3 = this.modalService.open({
			title: '详情',
			content: ClientRegisterUpdateModalComponent,
			onOk() {
			},
			onCancel() {

			},
			footer: false,
			componentParams: {
				data: item,
				isDetail: true,
			}
		});
		subscription3.subscribe(result => {
			if (result === 'onOk') {
				this.refreshData(true);
			}
		})
	}

	updateClient(item: any) {
		const subscription2 = this.modalService.open({
			title: '编辑',
			content: ClientRegisterUpdateModalComponent,
			onOk() {
			},
			onCancel() {

			},
			footer: false,
			componentParams: {
				data: item,
				isDetail: false,
			}
		});
		subscription2.subscribe(result => {
			if (result === 'onOk') {
				this.refreshData(true);
			}
		})
	}

	cancel = function () {
		
	};

	delete(item: any) {
		this.oauthRegisterService.deleteClient(item).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', '删除成功');
				this.refreshData();
			} else {
				this.message.create('error', resp.data.message ? resp.data.message : '删除失败');
			}
		}).catch(error => {
			this.message.create('error', '删除失败');
		})
	}
}
