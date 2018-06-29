import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { NzTreeComponent} from 'ng-tree-antd';
import { NzModalSubject,NzNotificationService, NzMessageService} from 'ng-zorro-antd';
import { utils } from '../../../../../shared/utils/utils';
import { config, service } from '../../../../../core/core.config';
import { CommonService } from '../../../../../shared/services/common.service';
import { Store } from "@ngrx/store";
import { LOADINGOPEN, LOADINGCLOSE } from "../../../../../shared/reducer/page-load";
@Component({
  selector: 'app-sp-templates-add-modal',
  templateUrl: './sp-templates-add-modal.component.html',
  styleUrls: ['./sp-templates-add-modal.component.scss']
})
export class SpTemplatesAddModalComponent implements OnInit {

  _searchKeywords: string = ''
  _nodes = []

  get selectNum (){
    let num = 0;
    for(let item of this._nodes){
      if(item.checked){
        num ++;
      }
    }
    return num
  }

  @Input() data

  @Input() item

  constructor(private commonService: CommonService,private store: Store<AppState>,private message: NzMessageService,private subject: NzModalSubject) { }

  ngOnInit() {
    this.getAllRegion();
  }


  @ViewChild(NzTreeComponent) tree: NzTreeComponent;
  filterNodes() {
    this.tree.treeModel.filterNodes(this._searchKeywords);
    if (!this._searchKeywords) this.tree.treeModel.collapseAll();
  }

  //获取所有省

  getAllRegion(){
    this.store.dispatch({type: LOADINGOPEN});
    this.commonService.getAllRegion({}).then(res => {
      this.store.dispatch({type: LOADINGCLOSE});
			if (utils.getStatusCode(res.code) == config.successCode) {
        if(res.data){
          let arr = [];
          for(let item of res.data){
            arr.push({
              id: item.id,
              name: item.label,
              checked: false,
              disableCheckbox: false,
            })
          }
          this._nodes = arr;
          for(let i of this.data.controls){
            for(let z of i.controls.freightRegionDtoList.value){
              for(let j of this._nodes){
                if(z.id == j.regionId){
                  j.disableCheckbox = true;
                }
              }
            }
          }
        }
			} else {
				this.message.create('error', res.message);
			}
    }).catch(err => {
      console.log(err)
      this.store.dispatch({type: LOADINGCLOSE});
			this.message.create('error', '网络连接失败');
    })
  }


  emitDataOutside(){
    for(let item of this._nodes){
      item.checked && this.item.controls.freightRegionDtoList.value.push({regionId: item.id,regionName: item.name})
    }
    this.subject.destroy('onOk');
  }
  handleCancel(e){
      this.subject.destroy('onCancel');
  }

}
