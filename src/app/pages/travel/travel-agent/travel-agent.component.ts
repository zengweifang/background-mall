import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TravelService } from '../travel.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodeHelperService } from "../../../core/code-helper.service";
import { getPageParams } from "../../../core/page.config";
import * as moment from 'moment';
import { utils } from '../../../shared/utils/utils';

@Component({
	selector: 'travel-agent',
	templateUrl: './travel-agent.component.html',
	styleUrls: ['./travel-agent.component.css']
})
export class TravelAgentComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private travelService: TravelService,
		private modalService: NzModalService,
		private message: NzMessageService,
		private codeHelperService: CodeHelperService,
		private router: Router
	) { }

	validateForm: FormGroup;
	_dataSet = [];

	_total = 0;
	_loading = true;

	_startDate: Date = null;
	_endDate: Date = null;

	commitData = {
		filter: {
			brokerName: "",
			phone: "",
			startTime: "",
			endTime: "",
		},
		orderBy: "-create_time",
		page: getPageParams(),
	};

	/* lifecycle */
	ngOnInit() {
		this.validateForm = this.fb.group({
			brokerName: ['', ],
			phone: ['', ],
			startDate: ['', ],
			endDate: ['', ],
		});

		this.refreshData();
	}

	/* event response */
	refreshData(reset = false) {
		if (reset) {
			this.commitData.page.currentPage = 1;
		}
		this._loading = true;
		this.travelService
			.getBokerList(this.commitData)
			.then(resp => {
				this._loading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._dataSet = resp.data ? resp.data : [];
					this._total = resp.page ? resp.page.totalCount : 0;
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

	check(item:any): void {
		utils.setLocalStorage('travelAgentItem', JSON.stringify(item));
		this.router.navigate(['/travel/travelAgent/travelAgentDetail', item.id]);
	}

	newArray = (len) => {
		const result = [];
		for (let i = 0; i < len; i++) {
			result.push(i);
		}
		return result;
	};
	_startValueChange = () => {
		if (this._startDate > this._endDate) {
			this._endDate = null;
		}
		this.commitData.filter.startTime = this._startDate ? utils.transformDateToString(this._startDate) : '';
	};
	_endValueChange = () => {
		if (this._startDate > this._endDate) {
			this._startDate = null;
		}
		this.commitData.filter.endTime = this._endDate ? utils.transformDateToString(this._endDate) : '';
	};
	_disabledStartDate = (startValue) => {
		if (!startValue || !this._endDate) {
			return startValue && startValue.getTime() > Date.now();
		}
		return (startValue.getTime() >= this._endDate.getTime()) || (startValue && startValue.getTime() > Date.now());
	};
	_disabledEndDate = (endValue) => {
		if (!endValue || !this._startDate) {
			return endValue && endValue.getTime() > Date.now();
		}
		return (endValue.getTime() <= this._startDate.getTime()) || (endValue && endValue.getTime() > Date.now());
	};
	get _isSameDay() {
		return this._startDate && this._endDate && moment(this._startDate).isSame(this._endDate, 'day')
	}
	get _endTime() {
		return {
			nzHideDisabledOptions: true,
			nzDisabledHours: () => {
				return this._isSameDay ? this.newArray(this._startDate.getHours()) : [];
			},
			nzDisabledMinutes: (h) => {
				if (this._isSameDay && h === this._startDate.getHours()) {
					return this.newArray(this._startDate.getMinutes());
				}
				return [];
			},
			nzDisabledSeconds: (h, m) => {
				if (this._isSameDay && h === this._startDate.getHours() && m === this._startDate.getMinutes()) {
					return this.newArray(this._startDate.getSeconds());
				}
				return [];
			}
		}
	}

	cancel = function () {

	};
}
