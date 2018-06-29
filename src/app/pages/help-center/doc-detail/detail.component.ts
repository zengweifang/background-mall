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
	selector: 'doc-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.scss']
})
export class DocDetailComponent implements OnInit {
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

	
	/* lifecycle */
	ngOnInit() {
		this.getDetail(this.docId);
	}

	detail:any = {};

	getDetail(id: string): void {
		this.helpCenterService.getDocDetail(id).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.detail = resp.data;
			} else {
				this.message.create('error', resp.message || '文档信息获取失败');
			}
		}).catch(error => {
			this.message.create('error', '文档信息获取失败');
		});
	}

	
}
