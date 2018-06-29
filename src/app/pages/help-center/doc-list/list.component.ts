import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HelpCenterService } from '../help-center.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodeHelperService } from "../../../core/code-helper.service";
import { getPageParams } from "../../../core/page.config";
import * as moment from 'moment';
import { utils } from '../../../shared/utils/utils';
import { CustomModalService } from '../../../shared/services/custom-modal.service';

@Component({
	selector: 'doc-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class DocListComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private helpCenterService: HelpCenterService,
		private modalService: NzModalService,
		private message: NzMessageService,
		private codeHelperService: CodeHelperService,
		private router: Router,
		private customModalService: CustomModalService
	) { }

	validateForm: FormGroup;
	_dataSet = [];

	_total = 0;
	_loading = true;

	_startDate: Date = null;
	_endDate: Date = null;

	commitData = {
		keyWords:'',
		userId:window.sessionStorage.getItem('userId'),
		page: getPageParams(),
	};

	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			keyWords: ['', ],
		});

		this.refreshData();
	}

	/* event response */
	refreshData(reset = false) {
		if (reset) {
			this.commitData.page.currentPage = 1;
		}
		this._loading = true;
		this.helpCenterService
			.getDocList(this.commitData)
			.then(resp => {
				this._loading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._dataSet = resp.data ? resp.data.helpDocumentVoList : [];
					this._total = resp.data ? resp.data.page.totalCount : 0;
				} else {
					this.message.create('error', resp.data.message ? resp.data.message : '加载失败');
				}
			}).catch(error => {
				this._loading = false;
				this.message.create('error', '加载失败');
			});
	}

	resetForm($event: MouseEvent) {
		this.validateForm.reset();
		for (const key in this.validateForm.controls) {
			this.validateForm.controls[key].markAsPristine();
		}
	}

	search($event: MouseEvent) {
		this.refreshData();
	}

	addDoc() {
		this.router.navigate(['/helpCenter/edit', '']);
	}

	check(item:any): void {
		this.router.navigate(['/helpCenter/detail', item.id]);
	}

	editDoc(item: any): void {
		this.router.navigate(['/helpCenter/edit', item.id]);
	}

	delete(item: any): void {
		this.customModalService._confirm({
			content: '确认删除？',
			onOk: () => {
				this.toDelete(item.id);
			}
		});
	}

	toDelete(id: string): void {
		this.helpCenterService.deleteDoc(id).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.message.create('success', resp.message ? resp.message : '操作成功');
				this.refreshData();
			} else {
				this.message.create('error', resp.message ? resp.message : '操作失败');
			}
		}).catch(error => {
			this.message.create('error', '操作失败');
		})
	}
}
