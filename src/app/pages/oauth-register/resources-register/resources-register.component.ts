import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { OauthRegisterService } from '../oauth-register.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResoursesRegisterAddModalComponent } from "./resourses-register-add-modal.component";
import { CodeHelperService } from "../../../core/code-helper.service";

@Component({
	selector: 'resources-register',
	templateUrl: './resources-register.component.html',
	styleUrls: ['./resources-register.component.css']
})
export class ResourcesRegisterComponent implements OnInit {
	validateForm: FormGroup;
	_dataSet = [];

	_current = 1;
	_pageSize = 10;
	_total = 0;
	_loading = true;

	constructor(
		private fb: FormBuilder,
		private oauthRegisterService: OauthRegisterService,
		private message: NzMessageService,
		private modalService: NzModalService,
		private codeHelperService: CodeHelperService,
	) { }

	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			name: ['', [Validators.required]],
			alias: ['', [Validators.required]],
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
			.getOAuthResourseList({
				'name': this.validateForm.controls['name'].value ? this.validateForm.controls['name'].value : '',
				'alias': this.validateForm.controls['alias'].value ? this.validateForm.controls['alias'].value : '',
				'currentPage': this._current,
				'pageSize': this._pageSize,
			})
			.then(resp => {
				this._loading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._dataSet = resp.data ? resp.data.list : [];
					this._total = resp.data ? resp.data.total : 0;
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

	addResourse() {
		const subscription = this.modalService.open({
			title: '注册资源',
			content: ResoursesRegisterAddModalComponent,
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

	cancel = function () {

	};

	delete(item: any) {

		this.oauthRegisterService.deleteResourse(item).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', '删除成功');
				this.refreshData();
			} else {
				this.message.create('error', resp.message ? resp.message : '删除失败');
			}
		}).catch(error => {
			this.message.create('error', '删除失败');
		})
	}
}
