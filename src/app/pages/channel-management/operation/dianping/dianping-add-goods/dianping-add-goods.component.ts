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
import { Location } from '@angular/common';


export interface ImageTextItem {
  index: number;
  type: 2 | 1;
  content: string;
  imgFileList?: any;
}

export interface ImageItem {
  imageUrl: string;
  id: number;
}

export interface SKUItem {
  duration: number;
  name: string;
  originalPrice: number;
  price: number;
  processTime: number;
}

export interface SubmitParameter {
  channelId: string;
  name: string;
  thumbUrl: string;//图片
  imagesUrls: string;//商品详情图
  minOrders: number;
  maxOrders: number;
  rank: number;
  serviceId: number;
  channelPackageDTOList: SKUItem[];//sku套餐
  channelCityDTOList: any[];//覆盖城市
  agstract: string;
  description: string;
  imageTextDTOList: ImageTextItem[];//图文详情
}
@Component({
  selector: 'dianping-add-goods',
  templateUrl: './dianping-add-goods.component.html',
  styleUrls: ['./dianping-add-goods.component.css']
})
export class DianpingAddGoodsComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: NzMessageService,
    private operationListService: OperationListService,
    private codeHelperService: CodeHelperService,
    private location: Location
  ) {

  }



  ngOnInit() {
    this.getChannelCity(this.cityParams);
    this._params.channelId = this.route.snapshot.paramMap.get('channelId');
    this.data.forEach(item => {
      this.tempEditObject[item.key] = {};
    })
    this.validateForm = this.fb.group({
      name: ['', Validators.required],
      thumbUrl: ['', Validators.required],
      imagesUrls: ['', Validators.required],
      minOrders: ['', Validators.required],
      maxOrders: ['', Validators.required],
      rank: ['', Validators.required],
      serviceId: ['', Validators.required],
      channelPackageDTOList: ['', Validators.required],
      channelCityDTOList: ['', Validators.required],
      agstract: ['', Validators.required],
      description: ['', Validators.required],
      imageTextDTOList: ['', Validators.required],
    });
  }


  validateForm: FormGroup;
  uploadUrl = service.uploadUrl;

  _params:SubmitParameter = {
    channelId: '',
    name: '',
    thumbUrl: '',//图片
    imagesUrls: '',//商品详情图
    minOrders: 1,
    maxOrders: 1,
    rank: 1,
    serviceId: 5,
    channelPackageDTOList: [],//sku套餐
    channelCityDTOList: [],//覆盖城市
    agstract: '',
    description: '',
    imageTextDTOList: [],//图文详情
  }

  tmpImageTextDTOList: ImageTextItem[] = [];

  options = [{ value: 5, label: '保洁' }, { value: 4, label: '洗衣' }, { value: 11, label: '家电清洗' }]//保洁=5，洗衣=4，家电清洗=11;
  selectedOption;

  editRow = null;
  tempEditObject = {};
  data = [];

  edit(data) {
    this.tempEditObject[data.key] = { ...data };
    this.editRow = data.key;
  }

  save(data) {
    Object.assign(data, this.tempEditObject[data.key]);
    this.editRow = null;
  }

  cancel(data) {
    this.tempEditObject[data.key] = {};
    this.editRow = null;
  }
  inputValue: string;

  reload(direction: string) {
    // this.getData();
    this.msg.success(`your clicked ${direction}!`);
  }

  select(ret: any) {
    console.log('nzSelectChange', ret);
  }

  change(ret: any) {
    console.log('nzChange', ret);
    if (ret.from === 'left') {
      ret.list.forEach(item => {
        this.selectedCitys.push(item);
      });
    } else if (ret.from === 'right') {
      ret.list.forEach(item => {
        this.selectedCitys[this.selectedCitys.indexOf(item)] = null;
        this.selectedCitys.splice(this.selectedCitys.indexOf(null), 1);
      });
    }
    this.updateCommitButtonStatus();
  }

  search(ret: any) {
    if (ret.direction === 'left') {
      this.cityParams.cityName = ret.value;
      this.cityParams.page.currentPage = 1;
      this.getChannelCity(this.cityParams);
    }
  }
  goodsThumbUrlFileList = [];

  goodsDetailFileList = [];

  previewImage = '';
  previewVisible = false;

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  getFormControl(name) {
    return this.validateForm.controls[name];
  }

  goodsImageUpdateStateChange($event) {
    if ($event.file.status === 'removed') {
      this._params.thumbUrl = ''
    } else if ($event.file.status === 'done') {
      if ($event.fileList.length > 0) {
        this._params.thumbUrl = $event.fileList[0].response.name;
      }
    }
    this.updateCommitButtonStatus();
  }

  goodsDetailImageUpdateStateChange($event) {
    if ($event.file.status === 'removed') {
      if ($event.fileList.length === 0) {
        this._params.imagesUrls = '';
      }
    } else if ($event.file.status === 'done' && $event.fileList.length > 0) {
      let imgs = [];
      $event.fileList.forEach(element => {
        imgs.push(element.response.name);
      });
      this._params.imagesUrls = imgs.join(';');
    }
    this.updateCommitButtonStatus();
  }

  imageTextUpdateStateChange($event, index) {
    if ($event.file.status === 'removed') {
      this.tmpImageTextDTOList[index].content = '';
    } else if ($event.file.status === 'done') {
      if ($event.fileList.length > 0) {
        this.tmpImageTextDTOList[index].content = $event.fileList[0].response.name;
      }
    }
    this.updateCommitButtonStatus();
  }

  addImageText(type: 2 | 1, index=1) {
    if (this.tmpImageTextDTOList.length >= 10) {
      this.message.create('error', '超过数量限制');
      return;
    }
    this.tmpImageTextDTOList.push({
      type: type,
      index: index,
      content: '',
      imgFileList:[],
    });
  }

  deleteImageText(item: ImageTextItem, index: number) {
    this.tmpImageTextDTOList.splice(index, 1);
  }

  disableSubmitButton = true;

  updateCommitButtonStatus() {
    console.log('change');
    let isFull = this._params.channelId && 
                this._params.name && 
                this._params.thumbUrl &&
                this._params.imagesUrls &&
                this._params.rank && 
                this._params.serviceId &&
                this._params.channelPackageDTOList.length &&
                this.isSKUFull() &&
                this.selectedCitys.length &&
                this._params.description &&
                this.tmpImageTextDTOList.length && 
                this.isImageTextFull();
    this.disableSubmitButton = !isFull;
  }

  isSKUFull(): boolean {
    let flag = this._params.channelPackageDTOList.length > 0;
    this._params.channelPackageDTOList.forEach(item => {
      if (!item.name) {
        flag = false;
      }
    })
    return flag;
  }

  isImageTextFull(): boolean {
    let flag = this.tmpImageTextDTOList.length > 0;
    this.tmpImageTextDTOList.forEach(item => {
      if (item.type === 1 && !item.content) {
        flag = false;
      } else if (item.type === 2 && !item.content) {
        flag = false;
      }
    })
    return flag;
  }

  addSKU() {
    this._params.channelPackageDTOList.push({
      duration: 1,
      name: "",
      originalPrice: 1,
      price: 1,
      processTime: 1,
    });
  }

  deleteSKU(data) {
    this.tempEditObject[data.key] = {};
    this.editRow = null;
    this._params.channelPackageDTOList[this._params.channelPackageDTOList.indexOf(data)] = null;
    this._params.channelPackageDTOList.splice(this._params.channelPackageDTOList.indexOf(null), 1);
  }

  cityParams={
    cityName:'',
    page:getPageParams()
  }

  cityList = [];
  selectedCitys = [];
  cityCount = 0;

  getChannelCity(params) {
    this.operationListService.getChannelCity(params).then(resp => {
      if (!this.codeHelperService.isServerError(resp) && resp.data.dataList.length) {
        this.preActive = resp.data.page.prePage;
        this.nextActive = resp.data.page.nextPage <= resp.data.page.totalPage;
        const ret = [];
        resp.data.dataList.forEach((item, index) => {
          item['title'] = item.cityName;
          this.selectedCitys.forEach((selectedItem) => {
            if (selectedItem.cityId == item.cityId) {
              item['disabled'] = true;
            }
          })
        });

        this.cityList = resp.data.dataList;
        this.cityCount = resp.data.page.totalCount;
      } else {
        this.message.create('error', '获取城市列表失败');
      }
    }).catch(error => {
      this.message.create('error', '连接失败');
    })
  }

  preActive: boolean = false;
  nextActive: boolean = false;

  nextPage(): void {
    this.cityParams.page.currentPage++;
    this.getChannelCity(this.cityParams);
  }

  prePage(): void {
    this.cityParams.page.currentPage--;
    this.getChannelCity(this.cityParams);
  }
  
  _submitForm() {
    // copy
    let submitImageTextList = this.tmpImageTextDTOList.map(x => Object.assign({}, x));
    submitImageTextList.forEach((item, index) => {
      // 修正index，避免删除中间元素再添加导致的影响，从1开始
      item.index = index + 1;
      // 删除多余属性，减少上传参数体积
      delete item.imgFileList;
    });
    this._params.channelCityDTOList = this.selectedCitys;
    this._params.imageTextDTOList = submitImageTextList;

    this.operationListService.dianpingAddGoods(this._params).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.message.create('success', resp.message ? resp.message : '添加成功');
        this.goBack();
      } else {
        this.message.create('error', resp.message ? resp.message : '添加失败');
      }
    }).catch(error => {
      this.message.create('error', '添加失败');
    });
  }

  goBack(): void {
		this.location.back();
	}
}
