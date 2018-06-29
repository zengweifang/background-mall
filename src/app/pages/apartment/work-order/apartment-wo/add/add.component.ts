import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService, NzModalSubject } from 'ng-zorro-antd';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApartmentService } from "../../../apartment.service";
import { CodeHelperService } from "../../../../../core/code-helper.service";
import { CoreService } from "../../../../../core/core.service";
import { service, config } from '../../../../../core/core.config';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class ApartmentWoAddComponent implements OnInit {

  _dataSet = {//公寓列表返回对象
    dataList: [],
    page: { totalCount: 0 }
  };
  _params = {//获取公寓列表参数
    page: {
      currentPage: 1,
      pageSize: 10
    },
    name: ''
  };
  _houseParams = {//获取房源列表参数
    apartmentId: sessionStorage.getItem('userId'),
    page: {
      currentPage: 1,
      pageSize: 10
    },
    address: ''
  };
  houseInfo = {//房源列表返回对象
    data: [],
    page: { totalCount: 0 }
  };
  skuParams = {//获取sku参数
    channelId: '',
    orderBy: '',
    page: {
      currentPage: 1,
      pageSize: 10
    },
  };
  searchOptions = [];//sku列表返回数组
  servicePeriodTypes = [{ id: 0, name: "无" }, { id: 1, name: "一周" }, { id: 2, name: "两周" }, { id: 3, name: "三周" }, { id: 4, name: "四周" }, { id: 5, name: "五周" }];
  selectedMultipleOption = { channelId: "", goodsId: "", storeId: "" };//绑定选择的sku对象
  _loading = false;//获取公寓列表loading
  _submitLoading = false;//提交工单按钮loading
  current = 0;//对应步骤按钮显示标识
  stepNumber = 1;//对应步骤标识
  selectedList = [];//已选房源list
  _dateRange = [null, null];//初始化时间值
  preActive: boolean = false;
  nextActive: boolean = false;
  submitParams = {//初始化提交工单参数
    apartmentId: sessionStorage.getItem('userId'),
    beginServiceTime: "",
    channelId: "",
    endServiceTime: "",
    goodsId: "",
    remark: "",
    resourceIds: [],
    storeId: "",
    period: 0,
    submitUserId: sessionStorage.getItem('userId')
  }

  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NzModalService,
    private apartmentService: ApartmentService,
    private codeHelperService: CodeHelperService,
    private coreService: CoreService,
    private subject: NzModalSubject) {
  }

  pre() {
    this.current -= 1;
    this.changeContent();
  }

  next() {
    switch (this.current) {
      case 0:
        if (this.selectedList.length != 0) {
          this.current += 1;
          this.changeContent();
        } else {
          this.message.create('warning', "未选择房源");
        }
        break;
      case 1:
        break;
    }
  }

  getHouseIds(data) {
    var ids = [];
    data.forEach(element => {
      ids.push(element.id);
    });
    return ids;
  }
  changeContent() {
    switch (this.current) {
      case 0: {
        this.stepNumber = 1;
        this.getHousingList(this._houseParams);
        break;
      }
      case 1: {
        this.getSkuList(this.skuParams);
        this.stepNumber = 2;
        break;
      }
    }
  }

  select(ret: any) {
    console.log('nzSelectChange', ret);
  }

  change(ret: any) {
    console.log('nzChange', ret);
    if (ret.from === 'left') {
      ret.list.forEach(item => {
        this.selectedList.push(item);
      });
    } else if (ret.from === 'right') {
      ret.list.forEach(item => {
        this.selectedList[this.selectedList.indexOf(item)] = null;
        this.selectedList.splice(this.selectedList.indexOf(null), 1);
      });
    }
  }

  search(ret: any) {
    if (ret.direction === 'left') {
      this._houseParams.address = ret.value;
      this._houseParams.page.currentPage = 1;
      this.getHousingList(this._houseParams);
    }
  }
  filterOption(inputValue, option) {
    return option.address.indexOf(inputValue) > -1;
  }

  test(data) {
    this.getHousingList(this._houseParams);
  }

  nextPage(): void {
    this._houseParams.page.currentPage++;
    this.getHousingList(this._houseParams);
  }

  prePage(): void {
    this._houseParams.page.currentPage--;
    this.getHousingList(this._houseParams);
  }

  /**获取sku */
  getSkuList(skuParams) {
    this.apartmentService.getSkuList(skuParams).then(res => {
      this.searchOptions = res.data.dataList;
    })
  }
  /**获取房源 */
  getHousingList(data) {
    this.apartmentService.getHousingList(data).then(res => {
      this.houseInfo = res;
      this.preActive = res.page.prePage;
      this.nextActive = res.page.nextPage <= res.page.totalPage;
      this.houseInfo.data.forEach((item, index) => {
        item['title'] = item.address;
        this.selectedList.forEach((selectedItem) => {
          if (selectedItem.id == item.id) {
            item['disabled'] = true;
          }
        })
      });
    })
  }
  /**提交工单操作 */
  done() {
    this._submitLoading = true;
    this.submitParams.beginServiceTime = this._dateRange[0];
    this.submitParams.endServiceTime = this._dateRange[1];
    this.submitParams.channelId = this.selectedMultipleOption.channelId;
    this.submitParams.goodsId = this.selectedMultipleOption.goodsId;
    this.submitParams.storeId = this.selectedMultipleOption.storeId;
    this.submitParams.resourceIds = this.getHouseIds(this.selectedList);
    this.apartmentService.saveWorkOrder(this.submitParams).then(res => {
      this._submitLoading = false;
      if (!this.codeHelperService.isServerError(res)) {
        this.router.navigate(['woManagement/apartment/list/list']);
      }
    })
  }

  ngOnInit() {
    this.getHousingList(this._houseParams);
  }
}
