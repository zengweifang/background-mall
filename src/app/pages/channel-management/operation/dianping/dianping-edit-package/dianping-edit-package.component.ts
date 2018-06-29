import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService, UploadFile } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { utils } from '../../../../../shared/utils/utils';
import { config, service } from '../../../../../core/core.config';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { OperationListService } from "../../operation-list.service";
import { CodeHelperService } from "../../../../../core/code-helper.service";
import { DianpingSKU } from "./dianpingSKU";
import { getPageParams } from '../../../../../core/page.config';
import { DianpingGoodsAddModalComponent } from "./dianping-goods-add-modal.component";

@Component({
  selector: 'dianping-edit-package',
  templateUrl: './dianping-edit-package.component.html',
  styleUrls: ['./dianping-edit-package.component.css']
})
export class DianpingEditPackageComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService,
    private router: Router,
    private msg: NzMessageService,
    private route: ActivatedRoute,
    private operationListService: OperationListService,
    private codeHelperService: CodeHelperService,
  ) {

  }

  channelId: string = '';
  channelName: string = '';
  goodsId: string = '';

  ngOnInit() {
    this.channelId = this.route.snapshot.paramMap.get('channelId');
    this.goodsId = this.route.snapshot.paramMap.get('goodsId');
    this.channelName = this.route.snapshot.paramMap.get('channelName');

    this.getPlatformGoodsRel(this.goodsId);
  }

  packageGoodsParams: any = {
    page: getPageParams(),
    packageId: '',
  }

  channelGoodsInfo: any = {};
  currentPackGoods: any[] = [];
  currentPackGoodsTotal: number = 0;
  areasParams: any = {
    page: getPageParams(),
    providerId: '',
    storeId: '',
    status: 1
  }

  getServiceType(serviceId: string): string {
    if (serviceId === '4') {
      return '洗衣';
    } else if (serviceId === '5') {
      return '保洁';
    } else if (serviceId === '11') {
      return '家电清洗';
    } else {
      return '';
    }
  }

  // 获取渠道商品信息
  getPlatformGoodsRel(goodsId: string): void {
    this.operationListService.getDianpingPlatformGoodsRel(goodsId).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.channelGoodsInfo = resp.data;
        this.packageGoodsParams.packageId = resp.data.channelPackageDTOList[0].id;
        this.listPackageGoodsByPage(this.packageGoodsParams);
      } else {
        this.message.create('error', resp.message ? resp.message : '加载失败');
      }
    }).catch(error => {
      this.message.create('error', '加载失败');
    })
  }

  changeTab(item): void {
    this.packageGoodsParams.packageId = item.id;
    this.listPackageGoodsByPage(this.packageGoodsParams);
  }

  listPackageGoodsByPage(params: any) {
    this.operationListService.getPackGoods(params).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        if (!resp.data) {
          this.currentPackGoods = [];
          this.currentPackGoodsTotal = 0;
        } else {
          this.currentPackGoods = resp.data.dataList;
          this.currentPackGoodsTotal = resp.data.page.totalCount;
          this.areasParams.providerId = this.currentPackGoods[0].providerId;
          this.areasParams.storeId = this.currentPackGoods[0].storeId;
          this.getStoreAreas(true);
        }
      } else {
        this.message.create('error', resp.message ? resp.message : '加载失败');
      }
    }).catch(error => {
      this.message.create('error', '加载失败');
    })
  }

  areasList: any[] = [];
  areasLoading = false;
  areasTotal = 0;
  getStoreAreas(reset: boolean) {
    if (reset) {
      this.areasParams.page.currentPage = 1;
    }
    this.areasLoading = true;
    this.operationListService.getStoreAreas(this.areasParams).then(resp => {
      this.areasLoading = false;
      if (!this.codeHelperService.isServerError(resp)) {
        this.areasList = resp.data.areas;
        this.areasTotal = resp.data.page.totalCount;
      } else {
        this.message.create('error', resp.message ? resp.message : '加载失败');
      }
    }).catch(error => {
      this.areasLoading = false;
      this.message.create('error', '加载失败');
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

  showDeleteCanfirm = (item: any) => {
    const _self = this;
    this.modal.confirm({
      title  : '删除后用户在大众点评下单后无法正常派单，请再次确认！',
      content: '',
      showConfirmLoading: true,
      onOk() {
        _self.deletePackageGoods(item);
      },
      onCancel() {

      }
    });
  }
  
  deletePackageGoods(item: any): void {
    this.operationListService.patchDeletePackageGoods([item.id]).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.listPackageGoodsByPage(this.packageGoodsParams);
      } else {
        this.message.create('error', resp.message ? resp.message : '操作失败');
      }
    }).catch(errro => {
      this.message.create('error', '操作失败');
    });
  }

  addGoods(): void {
    const subscription = this.modal.open({
			title: '添加商品',
			content: DianpingGoodsAddModalComponent,
			onOk() {
			},
			onCancel() {

			},
			footer: false,
			componentParams: {
				_channelName: this.channelName,
        _channelId: this.channelId,
        _packageId: this.packageGoodsParams.packageId,
			},
			width: '800px'
		});
		subscription.subscribe(result => {
			if (result === 'onOk') {
				// this.refreshData(true);
        // console.log('ok');
        this.listPackageGoodsByPage(this.packageGoodsParams);
			}
		})
  }

}
