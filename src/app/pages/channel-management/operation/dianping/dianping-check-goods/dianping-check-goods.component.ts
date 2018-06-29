import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService, UploadFile } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { utils } from '../../../../../shared/utils/utils';
import { config, service } from '../../../../../core/core.config';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { OperationListService } from "../../operation-list.service";
import { CodeHelperService } from "../../../../../core/code-helper.service";
import { DianpingSKU } from "./dianpingSKU";

@Component({
  selector: 'dianping-check-goods',
  templateUrl: './dianping-check-goods.component.html',
  styleUrls: ['./dianping-check-goods.component.css']
})
export class DianpingCheckGoodsComponent implements OnInit {
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
  uploadUrl = service.uploadUrl;
  imagesUrls = [];

  data = {
    id: '',
    channelId: '',
    name: '',
    thumbUrl: '',//图片
    imagesUrls: '',//商品详情图
    minOrders: 1,
    maxOrders: 1,
    rank: null,
    serviceId: null,
    channelPackageDTOList: [],//sku套餐
    channelCityDTOList: [],//覆盖城市
    agstract:'',
    description: '',
    imageTextDTOList: [],//图文详情
  }

  getData(id: string): void {
    this.operationListService.dianpingCheckGoods(id).then(resp => {
      if (!this.codeHelperService.isServerError(resp) && resp.data) {
        this.data = resp.data;
        this.data.channelCityDTOList.forEach(item => {
          item['direction'] = 'right';
          item['title'] = item.cityName;
        })
        this.setGoodsImages(this.data.imagesUrls);
      } else {
        this.message.create('error', '获取商品信息失败');
      }
    }).catch(error => {
      this.message.create('error', '获取商品信息失败');
    })
  }

  serverTypeFilter(id: number): string {
    //[{ value: 5, label: '保洁' }, { value: 4, label: '洗衣' }, { value: 11, label: '家电清洗' }]
    if (id === 5) return '保洁';
    if (id === 4) return '洗衣';
    if (id === 11) return '家电清洗';
    return '';
  }

  setGoodsImages(imageStr: string): void {
    this.imagesUrls = imageStr.split(';');
  }

  ngOnInit() {
    this.data.id = this.route.snapshot.paramMap.get('id');
    this.getData(this.data.id);
    
  }
}
