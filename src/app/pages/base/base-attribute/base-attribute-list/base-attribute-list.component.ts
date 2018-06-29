import { Component, OnInit } from '@angular/core';
import { BaseService } from '../base-attribute.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Base } from '../base-attribute';
import { fail } from 'assert';
@Component({
  selector: 'app-base-attribute-list',
  templateUrl: './base-attribute-list.component.html',
  styleUrls: ['./base-attribute-list.component.css']
})
export class BaseAttributeListComponent implements OnInit {
   _loading = true;
  //列表初始值
  _dataSet = {
    attributeGroupInfoVOList:[],
    page:{totalCount:0}
  };
  
  //列表请求参数
  _params = {
    page: {
      currentPage:1,
      pageSize:10
    },
    attrField:'',
    name:''
  }
  constructor(private BaseService: BaseService,private message:NzMessageService) {
  }

  _refreshData = () => {
    this._loading = true;
    this.BaseService.getBaseData(this._params).then(res => {
      this._loading = false;
      if(res.data){
        this._dataSet = res.data;
      }
      else{
        this._dataSet = {
          attributeGroupInfoVOList:[],
          page:{totalCount:0}
        };
      }
    },function(){
      this._loading = false;
    })
  };

  cancel = function () {
    this.message.info('取消任务！')
  }

  confirm = (data) => {
    this.BaseService.deleteBaseData(data).then(()=>{
      this._refreshData();
      this.message.info('删除成功！')
    });
  }

  filter(){
    this._refreshData();
  }

  ngOnInit() {
    this._refreshData();
  }
 

}
