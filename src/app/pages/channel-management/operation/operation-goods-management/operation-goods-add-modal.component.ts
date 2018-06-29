import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
import { OperationListService } from '../operation-list.service';
import { CodeHelperService } from "../../../../core/code-helper.service";
import { getPageParams } from "../../../../core/page.config";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { error } from 'util';


@Component({
    selector: 'nz-demo-component',
    templateUrl: './operation-goods-add-modal.component.html',
    styleUrls: ['./operation-goods-add-modal.component.css']
})
export class OperationGoodsAddModalComponent implements OnInit {
    constructor(
        private subject: NzModalSubject,
        private fb: FormBuilder,
        private operationListService: OperationListService,
        private message: NzMessageService,
        private codeHelperService: CodeHelperService,
    ) { }

    validateForm: FormGroup;
    validateForm2: FormGroup;
    _total = 0;
    _loading = true;
    _buttonLoading = false;
	_params = {
		page: getPageParams(),
		channelId: '',
		goodsName: '',
		goodsType: '',
		providerName: '',
		isVirtual: 0, // 初始为0   代表真实商品  
	}

	_virtualTotal = 0;
	_virtualLoading = true;

	_virtualGoodsParams = {
		page: getPageParams(),
		channelId: '',
		goodsName: '',
		goodsType: '',
		providerName: '',
		isVirtual: 1,
    }
    

    _dataSet = [];
	_virtualDataSet = [];

	editRow = null;
	tempEditObject = {};
	channelId = '';
	channelName = '';

    allChannelList = [];
    selectedOption;

    isLoading = false;
    _disabledButton = true;

    @Input()
    set _channelId(value: string) {
        this.channelId = value;
        this._params.channelId = this.channelId;
		this._virtualGoodsParams.channelId = this.channelId;
    }
    @Input()
    set _channelName(value: string) {
        this.channelName = value;
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
			goodsName: ['',],
			goodsType: ['',],
			providerName: ['',],
		});
		this.validateForm2 = this.fb.group({
			goodsName: ['',],
			goodsType: ['',],
			providerName: ['',],
		});
		this.refreshData();
		this.searchVirtualGoods();
    }

	
	refreshData(reset = false) {
		if (reset) {
			this._params.page.currentPage = 1;
		}
		this._loading = true;
		this.operationListService
			.getExcludeGoods(this._params)
			.then(resp => {
				this._loading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._dataSet = resp.data ? resp.data.channelGoodsVOList : [];
                    this._total = resp.data ? resp.data.page.totalCount : 0;
                    this._refreshStatus();
				} else {
					this._loading = false;
					this.message.create('error', resp.message ? resp.message : '加载失败');
				}
			}).catch(error => {
				this._loading = false;
				this.message.create('error', '加载失败');
			})
	}

	searchVirtualGoods(reset = false) {
		if (reset) {
			this._virtualGoodsParams.page.currentPage = 1;
		}
		this._virtualLoading = true;
		this.operationListService
			.getExcludeGoods(this._virtualGoodsParams)
			.then(resp => {
				this._virtualLoading = false;
				if (!this.codeHelperService.isServerError(resp)) {
					this._virtualDataSet = resp.data ? resp.data.channelGoodsVOList : [];
                    this._virtualTotal = resp.data ? resp.data.page.totalCount : 0;
                    this._virtualRefreshStatus();
				} else {
					this._virtualLoading = false;
					this.message.create('error', resp.message ? resp.message : '加载失败');
				}
			}).catch(error => {
				this._virtualLoading = false;
				this.message.create('error', '加载失败');
			})
	}

	_allChecked = false;
	_indeterminate = false;

	_virtualAllChecked = false;
	_virtualIndeterminate = false;

	_refreshStatus() {
		const allChecked = this._dataSet.every(value => value.checked === true);
		const allUnChecked = this._dataSet.every(value => !value.checked);
        this._allChecked = allChecked;
        this._disabledButton = !this._dataSet.some(value => value.checked);
		this._indeterminate = (!allChecked) && (!allUnChecked);
	};

	_virtualRefreshStatus() {
		const allChecked = this._virtualDataSet.every(value => value.checked === true);
		const allUnChecked = this._virtualDataSet.every(value => !value.checked);
        this._virtualAllChecked = allChecked;
        this._disabledButton = !this._virtualDataSet.some(value => value.checked);
		this._virtualIndeterminate = (!allChecked) && (!allUnChecked);
	}

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

	_virtualCheckAll(value) {
		if (value) {
			this._virtualDataSet.forEach(data => {
				data.checked = true;
			});
		} else {
			this._virtualDataSet.forEach(data => {
				data.checked = false;
			});
		}
		this._virtualRefreshStatus();
	}

	currentTabIndex = 0;

	selectedTab(index:number) {
        this.currentTabIndex = index;
        if (index === 0) {
            this._virtualCheckAll(false);
        } else {
            this._checkAll(false);
        }
	}

	translateNumber(num) {
		let num2 = (num * 100).toString();
		return num2.substring(0, num2.lastIndexOf('.') + 3);
	}

	resetForm($event: MouseEvent) {
		$event.preventDefault();
		this.validateForm.reset();
		for (const key in this.validateForm.controls) {
			this.validateForm.controls[key].markAsPristine();
		}
    }
    
    resetForm2($event: MouseEvent) {
		$event.preventDefault();
		this.validateForm2.reset();
		for (const key in this.validateForm.controls) {
			this.validateForm2.controls[key].markAsPristine();
		}
	}

	search($event: MouseEvent) {
		this.refreshData();
	}

	addGoods($event: MouseEvent) {
        let selectedItems = [];
        if (this.currentTabIndex === 0) {
            this._dataSet.forEach(item => {
                if (item.checked) {
                    if(!item.channelPrice){
                		item.channelPrice = item.goodsPrice;
                	}
                    selectedItems.push({
                        channelId: this.channelId,
                        goodsId: item.goodsId,
                        channelPrice: item.channelPrice,
                        costPrice: item.costPrice,
                        storesId: item.storeId
                    })
                }
            })
        } else {
            this._virtualDataSet.forEach(item => {
                if (item.checked) {
                    if(!item.channelPrice){
                		item.channelPrice = item.goodsPrice;
                	}
                    selectedItems.push({
                        channelId: this.channelId,
                        goodsId: item.goodsId,
                        channelPrice: item.channelPrice,
                        costPrice: item.costPrice,
                        storesId: item.storeId
                    })
                }
            })
        }
        this._buttonLoading = true;
        this.operationListService.addGoods(selectedItems).then(resp => {
            this._buttonLoading = false;
            if (!this.codeHelperService.isServerError(resp)) {
                this.message.create('success', resp.message ? resp.message : '添加成功');
                if (this.currentTabIndex == 0) {
					this.refreshData();
				} else {
					this.searchVirtualGoods();
				}
            } else {
                this._virtualLoading = false;
                this.message.create('error', resp.message ? resp.message : '添加失败');
            }
        }).catch(error => {
            this._buttonLoading = false;
            this.message.create('error', '添加失败');
        })
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
	/* event response */
	handleCancel(e) {
		this.subject.destroy('onCancel');
	}
}