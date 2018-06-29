import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CodeHelperService } from '../../../core/code-helper.service';
import { CommodityManagementService } from '../commodity-management.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import { utils } from '../../../shared/utils/utils';
import { NzMessageService } from 'ng-zorro-antd';
import { getPageParams } from '../../../core/page.config';
import { OperationListService } from '../../channel-management/operation/operation-list.service';
import { CustomModalService } from '../../../shared/services/custom-modal.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private commodityManagementService: CommodityManagementService,
    private codeHelperService: CodeHelperService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private operationListService: OperationListService,
    private customModalService: CustomModalService,
  ) { }

  validateForm: FormGroup;
  _loading = false;
  serviceOrderStatuses = [];
  goodsOrderStatuses = [];
  _dataSet = [];
  selectedTabIndex: number = 0;
  tabs = [
    {
      index: 13,
      tabName: '审核成功'
    },
    {
      index: 11,
      tabName: '审核中'
    },
    {
      index: 12,
      tabName: '审核失败'
    },
    {
      index: 1,
      tabName: '已失效'
    }
  ];
  _currentTabIndex = 13;

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: ['',],
      typeName: ['',],
      _startVerifyDate: ['', ],
      _endVerifyDate: ['', ],
      _startAuditPendingDate: ['',],
      _endAuditPendingDate: ['',],
      _startInvalidDate: ['', ],
      _endInvalidDate: ['', ],
    });
    this.refreshData();
  }


  _params = {
      page: getPageParams(),
      status: 13,
      name: '',
      typeName: '',
      startVerifyDate: '',
      endVerifyDate: '',
      startAuditPendingTime: '',
      endAuditPendingTime: '',
      startInvalidDate: '',
      endInvalidDate: '',
      providerId: utils.getSessionStorage('userId'),
  }

  paramsDatas = {};

  _total = 0;

  refreshData(reset = false) {
    if (reset) {
      this._params.page.currentPage = 1;
    }
      this._loading = true;
      this.commodityManagementService.getAuditList(this._params, {isInvalid: this._params.status === 1}).then(resp => {
        this._loading = false;
        if (!this.codeHelperService.isServerError(resp)) {
          this._dataSet = resp.data.list;
          this._total = resp.data.page.totalCount;
        } else {
          this.message.create('error', resp.message || '加载商品列表失败')
        }
      }).catch(error => {
        this._loading = false;
        this.message.create('error', '加载商品列表失败');
      });
  }

  _disabledDate = function (current) {
    return current && current.getTime() > Date.now();
  };

  resetForm() {
    this.validateForm.reset();
    this.search();
  }

  export() {
    // if (this._currentTabIndex === 1) {
    //   this._serviceExportFlag = !this._serviceExportFlag;
    // } else if (this._currentTabIndex === 2) {
    //   this._goodExportFlag = !this._goodExportFlag;
    // }
  }

  _allChecked = false;
	_indeterminate = false;

	_refreshStatus() {
		const allChecked = this._dataSet.every(value => value.checked === true);
		const allUnChecked = this._dataSet.every(value => !value.checked);
		this._allChecked = allChecked && this._dataSet.length > 0;
		this._indeterminate = (!allChecked) && (!allUnChecked);
	};

	_checkAll(value) {
		if (value) {
			this._dataSet.forEach(data => {
				data.checked = true;
			});
		} else {
			this._dataSet.forEach(data => {
				data.checked = false;
			});
		}
		this._refreshStatus();
	};

  saveSearchParams() {
    // if (this.channelName) {
    //   this.commodityManagementService.setOperationOrdersManagementSearchCriteria(searchParams);
    // } else {
    //   this.commodityManagementService.setOrdersManagementSearchCriteria(searchParams);
    // }
  }

  search() {
    // this.saveSearchParams();
    this.resetDate();
    this.setParams(this._currentTabIndex);
    this.refreshData(true);
  }
  
  resetDate(): void {
    this._params.startVerifyDate = '';
    this._params.endVerifyDate = '';
    this._params.startAuditPendingTime = '';
    this._params.endAuditPendingTime = '';
    this._params.startInvalidDate = '';
    this._params.endInvalidDate = '';
  }
  setParams(index: number): void {
    switch (index) {
      case 13: {
        this._params.startVerifyDate = this._startVerifyDate;
        this._params.endVerifyDate = this._endVerifyDate;
        break;
      }
      case 12: {
        this._params.startAuditPendingTime = this._startAuditPendingDate;
        this._params.endAuditPendingTime = this._endAuditPendingDate;
        this._params.startVerifyDate = this._startVerifyDate;
        this._params.endVerifyDate = this._endVerifyDate;
        break;
      }
      case 11: {
        this._params.startAuditPendingTime = this._startAuditPendingDate;
        this._params.endAuditPendingTime = this._endAuditPendingDate;
        break;
      }
      case 1: {
        this._params.startInvalidDate = this._startInvalidDate;
        this._params.endInvalidDate = this._endInvalidDate;
        break;
      }
      default:{}
    }
  }

  orderTypeChange(tab) {
    this.paramsDatas[this._currentTabIndex] = this._params;
    this._params = this.paramsDatas[tab.index] || {
      page: getPageParams(),
      status: tab.index,
      name: '',
      typeName: '',
      startVerifyDate: '',
      endVerifyDate: '',
      startAuditPendingTime: '',
      endAuditPendingTime: '',
      startInvalidDate: '',
      endInvalidDate: '',
      providerId: utils.getSessionStorage('userId')
    };
    this._params.status = tab.index;
    this._currentTabIndex = tab.index;
    this.resetDate();
    this.setParams(tab.index);
    
    this.refreshData(true);
  }
  
  _startVerifyDate = null;
  _endVerifyDate = null;

  _startAuditPendingDate = null;
  _endAuditPendingDate = null;

  _startInvalidDate = null;
  _endInvalidDate = null;
  
  newArray = (len) => {
    const result = [];
    for (let i = 0; i < len; i++) {
      result.push(i);
    }
    return result;
  };
  _startValueChange = (startDate: Date, endDate: Date) => {
    if (startDate > endDate) {
      endDate = null;
    }
  };
  _endValueChange = (startDate: Date, endDate: Date) => {
    if (startDate > endDate) {
      startDate = null;
    }
  };
  _disabledVerifyStartDate = (startDate: Date) => {
    if (!startDate || !this._endVerifyDate) {
      return startDate && startDate.getTime() > Date.now();
    }
    return (startDate.getTime() >= this._endVerifyDate.getTime()) || (startDate && startDate.getTime() > Date.now());
  };
  _disabledVerifyEndDate = (endDate: Date) => {
    if (!endDate || !this._startVerifyDate) {
      return endDate && endDate.getTime() > Date.now();
    }
    return (endDate.getTime() <= this._startVerifyDate.getTime()) || (endDate && endDate.getTime() > Date.now());
  };

  _isSameDay(startDate: Date, endDate: Date): boolean {
    return startDate && endDate && moment(startDate).isSame(endDate, 'day')
  }
  get _endVerifyTime() {
    return {
      nzHideDisabledOptions: true,
      nzDisabledHours: () => {
        return this._isSameDay(this._startVerifyDate, this._endVerifyDate) ? this.newArray(this._startVerifyDate.getHours()) : [];
      },
      nzDisabledMinutes: (h) => {
        if (this._isSameDay(this._startVerifyDate, this._endVerifyDate) && h === this._startVerifyDate.getHours()) {
          return this.newArray(this._startVerifyDate.getMinutes());
        }
        return [];
      },
      nzDisabledSeconds: (h, m) => {
        if (this._isSameDay(this._startVerifyDate, this._endVerifyDate) && h === this._startVerifyDate.getHours() && m === this._startVerifyDate.getMinutes()) {
          return this.newArray(this._startVerifyDate.getSeconds());
        }
        return [];
      }
    }
  }

  _disabledAuditPendingStartDate = (startDate: Date) => {
    if (!startDate || !this._endAuditPendingDate) {
      return startDate && startDate.getTime() > Date.now();
    }
    return (startDate.getTime() >= this._endAuditPendingDate.getTime()) || (startDate && startDate.getTime() > Date.now());
  };
  _disabledAuditPendingEndDate = (endDate: Date) => {
    if (!endDate || !this._startAuditPendingDate) {
      return endDate && endDate.getTime() > Date.now();
    }
    return (endDate.getTime() <= this._startAuditPendingDate.getTime()) || (endDate && endDate.getTime() > Date.now());
  };
  get _endAuditPendingTime() {
    return {
      nzHideDisabledOptions: true,
      nzDisabledHours: () => {
        return this._isSameDay(this._startAuditPendingDate, this._endAuditPendingDate) ? this.newArray(this._startAuditPendingDate.getHours()) : [];
      },
      nzDisabledMinutes: (h) => {
        if (this._isSameDay(this._startAuditPendingDate, this._endAuditPendingDate) && h === this._startAuditPendingDate.getHours()) {
          return this.newArray(this._startAuditPendingDate.getMinutes());
        }
        return [];
      },
      nzDisabledSeconds: (h, m) => {
        if (this._isSameDay(this._startAuditPendingDate, this._endAuditPendingDate) && h === this._startAuditPendingDate.getHours() && m === this._startAuditPendingDate.getMinutes()) {
          return this.newArray(this._startAuditPendingDate.getSeconds());
        }
        return [];
      }
    }
  }

  _disabledInvalidStartDate = (startDate: Date) => {
    if (!startDate || !this._endInvalidDate) {
      return startDate && startDate.getTime() > Date.now();
    }
    return (startDate.getTime() >= this._endInvalidDate.getTime()) || (startDate && startDate.getTime() > Date.now());
  };
  _disabledInvalidEndDate = (endDate: Date) => {
    if (!endDate || !this._startInvalidDate) {
      return endDate && endDate.getTime() > Date.now();
    }
    return (endDate.getTime() <= this._startInvalidDate.getTime()) || (endDate && endDate.getTime() > Date.now());
  };
  get _endInvalidTime() {
    return {
      nzHideDisabledOptions: true,
      nzDisabledHours: () => {
        return this._isSameDay(this._startInvalidDate, this._endInvalidDate) ? this.newArray(this._startInvalidDate.getHours()) : [];
      },
      nzDisabledMinutes: (h) => {
        if (this._isSameDay(this._startInvalidDate, this._endInvalidDate) && h === this._startInvalidDate.getHours()) {
          return this.newArray(this._startInvalidDate.getMinutes());
        }
        return [];
      },
      nzDisabledSeconds: (h, m) => {
        if (this._isSameDay(this._startInvalidDate, this._endInvalidDate) && h === this._startInvalidDate.getHours() && m === this._startInvalidDate.getMinutes()) {
          return this.newArray(this._startInvalidDate.getSeconds());
        }
        return [];
      }
    }
  }

  near(days: number) {
    let startDateAndEndDate = utils.getNearDay(days);
    // this._endDate = startDateAndEndDate.endDate;
    // this._startDate = startDateAndEndDate.startDate;
  }

  cateTip = "     ";

  getGoodsType(item:any) {
		this.operationListService.getGoodsType(item.goodsTypeId).then(resp => {
			if (!this.codeHelperService.isServerError(resp)) {
				this.cateTip = resp.data;
			} else {
				this.message.create('error', resp.message ? resp.message : '品类获取失败');
			}
		}).catch(error => {
			this.message.create('error', '品类获取失败');
		})
	}

	showTip($event, item:any) {
		if ($event) {
			this.getGoodsType(item);
		} else {
			this.cateTip = "     ";
		}
  }

  addNewGoods() {
    this.router.navigate(['commodityManagement/typeAdd']);
  }
  
  edit(item: any): void {
    this.router.navigate(['commodityManagement/edit', item.id])
  }

  check(item: any): void {
    this.router.navigate(['goods/review-detail', item.id, '1'])
  }

  delete(item: any): void {
    this.customModalService._confirm({
      content: '删除后无法恢复，你确定要删除该商品?',
      onOk: ()=> {
        this.goDelete([item.id]);
      }
    });
  }

  goDelete(ids: string[]): void {
    if (!ids.length) return;
    this.commodityManagementService.deleteGoods(ids).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.message.create('success', resp.message || '操作成功');
        this.refreshData(true);
      } else {
        this.message.create('error', resp.message || '操作失败');
      }
    }).catch(error => {
      this.message.create('error', '操作失败');
    })
  }

  pullManagement(item: any): void {
    // console.log('上下架管理');
    this.router.navigate(['commodityManagement/shelves', item.id]);
  }

  batchDown() {
    console.log('批量下架');
  }

  batchDelete() {
    let ids: string[] = [];
    this._dataSet.filter(item => item.checked).forEach(item => {
      ids.push(item.id);
    });

    this.customModalService._confirm({
      content: '删除后无法恢复，你确定要删除该商品?？',
      onOk: ()=> {
        this.goDelete(ids);
      }
    });
  }


}
