import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { Router,ActivatedRoute } from '@angular/router';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomModalService } from '../../../../shared/services/custom-modal.service';
import { Observable } from 'rxjs/Observable';
import { AmapService } from '../..//../../shared/services/amap.service';
import { StoreAddAreaService } from './store-add-area.service';
import { Store } from "@ngrx/store";
import { LOADINGOPEN, LOADINGCLOSE } from "../../../../shared/reducer/page-load";
@Component({
  selector: 'app-store-add-area',
  templateUrl: './store-add-area.component.html',
  styleUrls: ['./store-add-area.component.scss']
})
export class StoreAddAreaComponent implements OnInit {
  _current:number = 1;
  _storeId: string = '';
  _from: string = '';
  _reqParam = {
    "storesId": '', //搜索店铺id
    "name": "", //搜索区域名称
    "page": utils.pageParams()
  }
  _resData = [];
  _showSearch: boolean = false;
  _canDeactivate: boolean = false;
  constructor(private fb: FormBuilder,private message: NzMessageService,public customModalService: CustomModalService,private router:Router,private notificationService: NzNotificationService,private amapService: AmapService,private activatedRoute:ActivatedRoute,private storeAddAreaService: StoreAddAreaService,private store: Store<AppState>) {
    this._storeId = this.activatedRoute.snapshot.paramMap.get('id');
    this._from = this.activatedRoute.snapshot.queryParamMap.get('from');
    if(this._from == 'check'){
      this._showSearch = true;
    }else{
      this._showSearch = false;
    }
    this._reqParam.storesId = this._storeId;

  }

  

  ngOnInit() {

    let start = async () => {
      return await this.amapService.create('storeAddAreaGis',true,12,null);
    }

    start().then(map => {
      this.amapService.position(map);
      this.amapService.pageThis = this;
    }).catch(err => {
      this.notificationService.create('error','地图加载失败，请刷新页面','');
    })
  }
 
  //获取审核通过的店铺服务区域
  refreshData(param){
    this.store.dispatch({type: LOADINGOPEN});
    this.amapService.clearAllpolygons();
    this.amapService.polygons.splice(0,this.amapService.polygons.length);
    this.amapService.clearPolylineEditorObjs();
    return new Promise((resolve,reject) => {
      this.storeAddAreaService.getStorePolygonAreaList(param).then(res => {
        this.store.dispatch({type: LOADINGCLOSE});
        if(utils.getStatusCode(res.code) == config.successCode){
          if(res.data){
            this._resData = res.data.storeServiceAreaDtoList ? res.data.storeServiceAreaDtoList : [];
            let copyResData = utils.deepCopy(this._resData);
            for(let item of copyResData){
              let polygonObjDraw = this.amapService.polygonObjDraw(item.content,true,false);
              this.amapService.polygons.push({
                id: item.id,
                name: item.name,
                content: polygonObjDraw.polygon,
                status: item.changeType,
                showInput: false,
                deleteStatus: false,
                moreThanNumber: polygonObjDraw.moreThanNumber,
                showSelectColor: false
              })
            }
          }else{
            this._resData = [];
          }
          resolve({
              polygons: this.amapService.polygons,
              totalCount: res.data.page.totalCount,
          });
        }else{
          this.message.create('error', res.message);
        }
      }).catch(err => {
        console.log(err);
        this.store.dispatch({type: LOADINGCLOSE});
        this.message.create('error', '网络加载失败');
      })
    })
  }

  saveAreaFun(){
    // 区域名称不能为空且不能处于编辑状态
    for(let item of this.amapService.polygons){
      if(!item.name){
        this.notificationService.create('error','区域名不能为空','');
        return;
      }

      if(item.showInput){
          this.notificationService.create('error','请保存区域名后再提交','');
          return;
      }
    }

    for(let item of this.amapService.addPolygons){
      if(!item.name){
        this.notificationService.create('error','区域名不能为空','');
        return;
      }

      if(item.showInput){
          this.notificationService.create('error','请保存区域名后再提交','');
          return;
      }
    }
    
    // 判断已添加区域是否进行了修改操作

    for(let item of this.amapService.polygons){
      for(let k of this._resData){
        if(item.id && item.id == k.id && !item.deleteStatus){
          var arrs = this.amapService.utilsArray(item.content.getPath(),3);
          if(this.amapService.parseHash(arrs) != this.amapService.parseHash(k.content)){
              item.status = 3;
          }
        }
      }
    }


    for(let k = 0 , len = this.amapService.polygons.length; k < len ; k ++){
        if(this.amapService.polygons[k].status !== 0){
            break;
        }
        if(k == len - 1 && this.amapService.polygons[k].status == 0 && this.amapService.addPolygons.length <= 0){
          this.notificationService.create('error','您未新增、删除、修改区域,请操作后再提交','');
            return;
        }
    }
    let reqArr = [];
    for(let item of this.amapService.polygons){
      if(item.status !== 0){
        let arrs = this.amapService.utilsArray(item.content.getPath(),3);
        if(!item.moreThanNumber){
            if(arrs[0][0] instanceof Array){
                for(let e = 0 , len = arrs.length; e < len; e ++){
                    if(arrs[e][0][0] == arrs[e][arrs[e].length - 1][0] && arrs[e][0][1] == arrs[e][arrs[e].length - 1][1]){
                       
                    }else{
                        arrs[e].push(arrs[e][0]);
                    }
                }
            }else{
                if(arrs[0][0] == arrs[arrs.length - 1][0] && arrs[0][1] == arrs[arrs.length - 1][1]){

                }else{
                    arrs.push(arrs[0]);
                }
            }
            
        }
        reqArr.push({
            id: item.id,
            name: item.name,
            status: item.status,
            content: JSON.stringify(arrs)
        })
        
      }
    }

    for(let item of this.amapService.addPolygons){
      let arrs = this.amapService.utilsArray(item.content.getPath(),3);
      if(!item.moreThanNumber){
          if(arrs[0][0] instanceof Array){
              for(let r = 0 , len = arrs.length; r < len; r ++){
                  if(arrs[r][0][0] == arrs[r][arrs[r].length - 1][0] && arrs[r][0][1] == arrs[r][arrs[r].length - 1][1]){

                  }else{
                      arrs[r].push(arrs[r][0]);
                  }
              }
          }else{
              if(arrs[0][0] == arrs[arrs.length - 1][0] && arrs[0][1] == arrs[arrs.length - 1][1]){
                  
              }else{
                  arrs.push(arrs[0]);
              }
          }
      }
      reqArr.push({
          id: "",
          name: item.name,
          status: item.status,
          content: JSON.stringify(arrs)
      })
    }
    
    let reqParam = {
        changeList: reqArr,
        storeId: this._storeId
    }
    this.store.dispatch({type: LOADINGOPEN});
    this.storeAddAreaService.submitAreaVerify(reqParam).then(res => {
      this.store.dispatch({type: LOADINGCLOSE});
      if(utils.getStatusCode(res.code) == config.successCode){
        if(this._from == 'check'){
          this.message.create('success', res.message);
          utils.setSessionStorage('checkServiceAreaInitTab','audit');
          this.router.navigate(['/storeManagement/storeList/storeList']) //跳转审核记录页面
        }else{
          let _self = this;
          this.customModalService._confirm({
            title:'提交审核成功！',
            content: '成功添加商品后店铺才会在app上显示是否马上添加商品？',
            okText: '现在添加',
            cancelText: '以后再说',
            onOk(){
              _self._canDeactivate = true;
              _self.router.navigate(['/storeManagement/storeAdd/storeAddGoods',_self._storeId]) //跳转添加商品
            },
            onCancel(){
              _self._canDeactivate = true;
              _self.router.navigate(['/storeManagement/storeList/storeList']) //跳转列表页面
            },

          });
        }
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      console.log(err)
      this.store.dispatch({type: LOADINGCLOSE});
      this.message.create('error', '网络加载失败');
    })
  }  

  saveArea(){
    if(this._from == 'check'){
      // 没有区域
      if(this.amapService.polygons.length <= 0 && this.amapService.addPolygons.length <= 0){
        this.notificationService.create('error','至少需要添加一个区域才能提交','');
        return;
      }
      this.saveAreaFun();
    }else{
      if(this.amapService.polygons.length <= 0 && this.amapService.addPolygons.length <= 0){
        let _self = this;
        this.customModalService._confirm({
          title:'提示',
          content: '成功添加商品后店铺才会在app上显示是否马上添加商品？',
          okText: '现在添加',
          cancelText: '以后再说',
          onOk(){
            _self._canDeactivate = true;
            _self.router.navigate(['/storeManagement/storeAdd/storeAddGoods',_self._storeId], {queryParams: {from: 'add'}}) //跳转添加商品
          },
          onCancel(){
            _self._canDeactivate = true;
            _self.router.navigate(['/storeManagement/storeList/storeList']) //跳转列表页面
          },

        });
      }else{
        this.saveAreaFun();
      }
    }
  }

  // 处理未保存的更改  路由守卫
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    // observable  貌似不行  Promise<boolean> | boolean 可以
    if ((this.amapService.polygons.length <= 0 && this.amapService.addPolygons.length <= 0) || this._canDeactivate){
        return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    
    return new Promise(resolve => {
      this.customModalService._confirm({
        title:'温馨提示',
        content: '如果确认返回，刚编辑的信息不会被保存。',
        okText: '确认',
        cancelText: '取消',
        onOk(){
          resolve(true)
        },
        onCancel(){
          resolve(false)
        },

      });
    })
  }


  //跳转审核记录页面
  goPage(){
    // $state.go('checkServiceAreaAuditRecord',{id: storeId})
  }
  //查看已添加服务区域页面跳转
  toBack() {
    if (this._from == 'check') {//查看已添加服务区域页面跳转
        // $state.go('checkServiceArea', { id: $stateParams.id });
    }else {//返回
      this.router.navigate(['/storeManagement/storeList/storeList']) //跳转列表页面
    }
  };
}
