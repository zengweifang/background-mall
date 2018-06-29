import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { SendOrderService } from '../send-order.service';
import { NzMessageService } from 'ng-zorro-antd';
import { CodeHelperService } from "../../../../core/code-helper.service";
import { getPageParams } from "../../../../core/page.config";
import { CommonService } from "../../../../shared/services/common.service";

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { error } from 'util';


@Component({
  selector: 'nz-demo-component',
  templateUrl: './provider-add-modal.component.html',
	styleUrls: ['./provider-add-modal.component.css']
})
export class ProviderAddModalComponent implements OnInit {

  // 步骤条
  current = 0;

  index = 'First-content';
  _data: any;

  pre() {
    this.current -= 1;
    this.changeContent();
  }

  next() {
    this.current += 1;
    this.changeContent();
  }

  done() {
    this._message.success('done');
  }

  changeContent() {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

  
  _name: string;
  isLoading = false;
  _total = 0;
  _dataSet = [];
  _allChecked = false;
  _indeterminate = false;

  _params = {
    page: getPageParams(),
    provider: null,
    serviceName: '',
    status: 1,
  }

  @Input()
  set name(value: string) {
    this._name = value;
  }
  @Input()
  set data(value: any) {
    this._data = value;
  }

  _refreshStatus() {
    const allChecked = this._dataSet.every(value => value.disabled || value.checked);
    const allUnChecked = this._dataSet.every(value => value.disabled || !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
  };

  _checkAll(value) {
    if (value) {
      this._dataSet.forEach(data => {
        if (!data.disabled) {
          data.checked = true;
        }
      });
    } else {
      this._dataSet.forEach(data => data.checked = false);
    }
    this._refreshStatus();
  };

  
  submitForm = ($event, value) => {
    $event.preventDefault();
    // for (const key in this.validateForm.controls) {
    //   this.validateForm.controls[ key ].markAsDirty();
    // }
  };

  handleCancel(e) {
    this.subject.destroy('onCancel');
  }

  constructor(
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private sendOrderService: SendOrderService,
    private message: NzMessageService,
    private codeHelperService: CodeHelperService,
    private _message: NzMessageService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.getSupplierList();
    this.getProvinceAndCity();
  }

  nodes = [];
  childrenNodes = [];
  options = {
    // getChildren: ($event) => {
    //   return new Promise((resolve, reject) => {
    //     this.commonService.getCityAllChildren($event.id).then(resp => {
    //       if (!this.codeHelperService.isServerError(resp)) {
    //         resolve(this.configChildrenNodes(resp.data));
    //       } else {
    //         reject(resp.message);
    //       }
    //     }).catch(error => {
    //       reject('faile');
    //     })
    //   });
    // }
  };

  configChildrenNodes(data:any[]): any[] {
    let prefecture = [];
    let town = [];

    data.forEach(item => {
      if (item.level === 3) {
        prefecture.push(item);
      } else if (item.level === 4) {
        town.push(item);
      }
    });

    prefecture.forEach(item => {
      item['children'] = town.filter(city => {
        return item.id === city.parentId;
      })
    });
    return prefecture;
  }
  
  getProvinceAndCity() {
    this.commonService.getAllProvinceAndCity(null).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.setNodes(resp.data);
      } else {
        this.message.create('error', resp.message ? resp.message : '获取省市区失败');
      }
    }).catch(error => {
      this.message.create('error', '获取省市区失败');
    })
  }

  province: any[];

  setNodes(data:any[]) {
    let provinces = [];
    let cities = [];

    data.forEach(item => {
      if (item.level === 1) {
        provinces.push(item);
      } else if (item.level === 2) {
        // item['hasChildren'] = true;
        cities.push(item);
      }
    });

    provinces.forEach(item => {
      item['children'] = cities.filter(city => {
        return item.id === city.parentId;
      })
    });

    this.nodes = provinces.filter(item => {
      return item.children && item.children.length;
    });
  }

  setProvince(data:any[]) {
    let tmpArr = [];
    data.forEach(item => {
      if (item.level === 1) {
        tmpArr.push(item);
      }
    })
    this.province = tmpArr;
  }

  getSupplierList(reset=false) {
    if (reset) {
      this._params.page.currentPage = 1;
    }
    this.isLoading = true;
    this.sendOrderService.getSupplierList(this._params).then(resp => {
      this.isLoading = false;
      if (!this.codeHelperService.isServerError(resp)) {
        this._dataSet = resp.data.serviceProviderListDtos;
        this._total = resp.data.page.totalCount;
        this._refreshStatus();
      } else {
        this.message.create('error', resp.message ? resp.message : '获取供应商失败');
      }
    }).catch(resp => {
      this.isLoading = false;
      this.message.create('error', '获取供应商失败')
    });
  }

  getSubmitParams() {
    let providerIds: string[] = [];
    let cityIds: string[] = []; 
    this._dataSet.forEach(item => {
      if (item.checked) {
        providerIds.push(item.id);
      }
    })
    this.nodes.filter(item => {
      return item.checked || item.halfChecked;
    }).forEach(item => {
      if (item.checked) {
        item.children.forEach(cityItem => {
          cityIds.push(cityItem.id);
        });
      } else if (item.halfChecked) {
        item.children.forEach(cityItem => {
          if (cityItem.checked) {
            cityIds.push(cityItem.id);
          }
        });
      }
    });

    return {
      providerIds: providerIds,
      cityIds: cityIds,
    }
  }

  _submitForm() {
    this.sendOrderService.addProviderInOrder(this.getSubmitParams()).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.message.create('success', resp.message ? resp.message : '操作成功');
        this.subject.destroy('onOk');
      } else {
        this.message.create('error', resp.message ? resp.message : '操作失败');
      }
    }).catch(error => {
      this.message.create('error', '操作失败');
    })
    
  }
}