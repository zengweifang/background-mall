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
  selector: 'app-shelves',
  templateUrl: './shelves.component.html',
  styleUrls: ['./shelves.component.scss']
})
export class ShelvesComponent implements OnInit {
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
  _dataSet = [];
  goodsId: string = '';

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: ['',],
      status: ['',],
    });
    this.goodsId = this.route.snapshot.paramMap.get('goodsId');
    this.getGoodsInfo(this.goodsId);
    this.getShopList();
  }

  goodsInfo = {
    "id": "",
    "name": "",
    "thumbnail": "",
    "price": 0,
    "originalPrice": 0,
    "costPrice": null,
    "goodsTypeId": "",
    "typeName": "",
    "shelvesNum": 0,
    "addNum": 0,
    "auditTime": null,
    "auditPendingTime": null,
    "invalidDate": null,
    "updated": null
  }

  getGoodsInfo(goodsId: string): void {
    this.commodityManagementService.getGoodsInfo(goodsId).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.goodsInfo = resp.data;
        this._dataSet.push(this.goodsInfo);
      } else {
        this.message.create('error', resp.message || '获取商品信息失败');
      }
    }).catch(error => {
      this.message.create('error', '获取商品信息失败');
    })
  }

  barstatus = [{ id: '', name: '全部' }, { id: '1', name: '已上架' }, { id: '2', name: '已下架' }];

  shopListParams = {
    goodsId: this.route.snapshot.paramMap.get('goodsId'),
    name: '',
    status: '',
    page: getPageParams()
  }

  _total = 0;

  getShopList(reset = false): void {
    if (reset) {
      this.shopListParams.page.currentPage = 1;
    }
    this.commodityManagementService.getShopList(this.shopListParams).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.shopDataSet = resp.data.list;
        this._total = resp.data.page.totalCount;
        this._refreshStatus();
      } else {
        this.message.create('error', resp.message || '获取店铺列表失败');
      }
    }).catch(error => {
      this.message.create('error', '获取店铺列表失败');
    })
  }

  shopDataSet = [];

  _allChecked = false;
	_indeterminate = false;

	_refreshStatus() {
		const allChecked = this.shopDataSet.every(value => value.checked === true);
		const allUnChecked = this.shopDataSet.every(value => !value.checked);
		this._allChecked = allChecked && this.shopDataSet.length > 0;
		this._indeterminate = (!allChecked) && (!allUnChecked);
	};

	_checkAll(value) {
		if (value) {
			this.shopDataSet.forEach(data => {
				data.checked = true;
			});
		} else {
			this.shopDataSet.forEach(data => {
				data.checked = false;
			});
		}
		this._refreshStatus();
  };

  getCheckedIds(dataSet: any[]): string[] {
    let ids = [];
    this.shopDataSet.filter(item => item.checked).forEach(item => {
      ids.push(item.id);
    });
    return ids;
  }

  batchPull() {
    let ids = this.getCheckedIds(this.shopDataSet);
    this.pullOrpush({
      "goodsId": this.goodsId,
      "status": 2,
      "storesId": ids
    })
  }

  batchPush() {
    let ids = this.getCheckedIds(this.shopDataSet);
    this.pullOrpush({
      "goodsId": this.goodsId,
      "status": 1,
      "storesId": ids
    })
  }

  setBatchInventory() {
    console.log(this.batchInventory);
    let ids = [];
    this.shopDataSet.filter((item) => item.checked).forEach(item => {
      ids.push(item.id);
    });
    if (!ids.length) {
      return;
    }
    let params = {
      goodsId: this.goodsId,
      quantity: this.batchInventory,
      storeIds: ids
    }
    this.updateQuantity(params);
  }

  editRow = null;
  tempEditObject = {};

  edit(data: any): void {
    this.tempEditObject[ data.id ] = { ...data };
    this.editRow = data.id;
  }

  save(data: any): void {
    this.updateQuantity({
      goodsId: this.goodsId,
      quantity: data.quantity,
      storeIds: [data.id],
    })
    this.editRow = null;
  }

  cancel(data) {
    this.tempEditObject[ data.id ] = {};
    this.editRow = null;
  }

  updateQuantity(params: any): void {
    this.commodityManagementService.storesQuantityUpdate(params).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.message.create('success', resp.message || '操作成功');
        this.getShopList();
      } else {
        this.message.create('error', resp.message || '更新库存失败');
      }
    }).catch(error => {
      this.message.create('error', '更新库存失败');
    })
  }

  pullInShop(data: any): void {
    this.pullOrpush({
      "goodsId": this.goodsId,
      "status": 2,
      "storesId": [data.id]
    })
  }

  pushInShop(data: any): void {
    this.pullOrpush({
      "goodsId": this.goodsId,
      "status": 1,
      "storesId": [data.id]
    })
  }

  pullOrpush(params: any): void {
    if (params.status === 2) {
      this.customModalService._confirm({
        content: '下架后商品无法在app的店铺中展示，是否确定操作?',
        onOk: () => {
          this.pullOrPushRequest(params);
        }
      })
    } else {
      this.pullOrPushRequest(params);
    }
    
  }

  pullOrPushRequest(params: any): void {
    this.commodityManagementService.storesGoodsUpAndDown(params).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.message.create('success', resp.message || '操作成功');
        this.getShopList();
      } else {
        this.message.create('error', resp.message || '操作失败');
      }
    }).catch(error => {
      this.message.create('error', '操作失败');
    })
  }
  
  resetForm() {
    this.validateForm.reset();
    this.getShopList(true);
  }

  batchInventory = 0;

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
}
