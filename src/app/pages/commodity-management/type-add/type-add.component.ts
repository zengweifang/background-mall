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
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-type-add',
  templateUrl: './type-add.component.html',
  styleUrls: ['./type-add.component.scss']
})
export class TypeAddComponent implements OnInit {
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

  ngOnInit() {
    this.validateForm = this.fb.group({
    });
    this.getTypes(1);
  }

  _params = {
      parentId:0,
      providerId: utils.getSessionStorage('userId'),
  }

  dataSet = {
    prevList: [],
    middleList: [],
    lastList: [],
  }

  /**
   * 获取类型
   * 
   * @param {(1 | 2 | 3)} level 不同级别的类型
   * @memberof TypeAddComponent
   */
  getTypes(level: 1 | 2 | 3): void {
    this.commodityManagementService.getGoodsType(this._params).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        if (level === 1) {
          this.dataSet.prevList = resp.data;
          this.dataSet.prevList.forEach(item => {
            item['value'] = item.id;
            item['label'] = item.name;
          })
        } else if (level === 2) {
          this.dataSet.middleList = resp.data;
        } else if (level === 3) {
          this.dataSet.lastList = resp.data
        }
      } else {
        this.message.create('error', resp.message || '获取类别失败');
      }
    }).catch(error => {
      this.message.create('error', '获取类别失败');
    })
  }

  getSubTypes(): Promise<any> {
    return this.commodityManagementService.getGoodsType(this._params);
  }

  _value: any[] = null;

  enabledNextButton = false;

  _console(value) {
    this.enabledNextButton = value.length === 3;
    if (value.length === 3) {
      this.saveParams.lastName = value[2];
    }
  }

  /** load data async */
  loadData(e: {option: any, index: number, resolve: Function, reject: Function}): void {
    if (e.index === -1) {
      e.resolve(this.dataSet.prevList);
      return;
    }

    const option = e.option;
    option.loading = true;
    if (e.index === 0) {
      this._params.parentId = option.id;
      this.saveParams.firstName = option.label;
      this.getSubTypes().then(resp => {
        option.loading = false;
        if (resp.data && resp.data.length) {
          let data = resp.data;
          data.forEach(item => {
            item['value'] = item.id;
            item['label'] = item.name;
          });
          this.dataSet.middleList = data;
          e.resolve(data);
        }
      }).catch(error => {
        option.loading = false;
      })
    }
    if (e.index === 1) {
      this._params.parentId = option.id;
      this.saveParams.secondName = option.label;
      this.getSubTypes().then(resp => {
        option.loading = false;
        if (resp.data) {
          let data = resp.data;
          data.forEach(item => {
            item['value'] = item.id;
            item['label'] = item.name;
            item['isLeaf'] = true;
          });
          this.dataSet.lastList = data;
          e.resolve(data);
        }
      }).catch(error => {
        option.loading = false;
      })
    }
  }

  saveParams = {
    firstName:'',
    secondName:'',
    lastName:'',
    typeId:''
  }

  next() {
    this.saveParams.typeId = this._value[2];
    this.dataSet.lastList.forEach(item => {
      if (item.id === this.saveParams.typeId) {
        this.saveParams.lastName = item.name;
      }
    })
    utils.setLocalStorage('commCategorie', JSON.stringify(this.saveParams));
    this.router.navigate(['commodityManagement/new']);
  }

}
