import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { SupplierManageService } from '../../supplier-manage.service';
import { NzMessageService} from 'ng-zorro-antd';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { AmapService } from '../../../../shared/services/amap.service';
import { Store } from "@ngrx/store";
import { LOADINGOPEN, LOADINGCLOSE } from "../../../../shared/reducer/page-load";
@Component({
  selector: 'app-supplier-audit-business-detail',
  templateUrl: './supplier-audit-business-detail.component.html',
  styleUrls: ['./supplier-audit-business-detail.component.scss']
})
export class SupplierAuditBusinessDetailComponent implements OnInit {
  _id: string = '';
  _storeId: string = '';
  _status: string = '';
  _serviceName: string = '';
  _storesName: string = '';
  _createTime: string = '';
  _reqParam: SupplierAuditBusinessDetailReqParam;
  _resData: any;
  _gisShowRadio: boolean;
  _gisShowAuditBtn: boolean;
  constructor(private supplierManageService: SupplierManageService,private message: NzMessageService,private router: Router,private activatedRoute:ActivatedRoute,private amapService: AmapService,private store: Store<AppState>) {
    this._id = this.activatedRoute.snapshot.paramMap.get('id');
    this._storeId = this.activatedRoute.snapshot.paramMap.get('storeId');
    this._status = this.activatedRoute.snapshot.queryParamMap.get('status');
  }

  ngOnInit() {

    switch (this._status){
      case '1': 
        this._gisShowRadio = true;
        this._gisShowAuditBtn = true;
        this._reqParam = {
          storeId: this._storeId,
          status: this._status
        }
        break;
      case '2':
      case '3': 
        this._gisShowRadio = false;
        this._gisShowAuditBtn = false;
        this._reqParam = {
          storeId: this._storeId,
          status: this._status,
          id: this._id
        }
        break;
    }

    let start = async () => {
      return await this.amapService.create('supplierAuditDetailGis',true,12,null);
    }

    start().then(map => {
      this.amapService.position(map);
      this.amapService.pageThis = this;
    })
  }

  refreshData(){
    this.store.dispatch({type: LOADINGOPEN});
    this.amapService.clearAllpolygons();
    this.amapService.clearStore();
    return new Promise((resolve,reject) => {
      this.supplierManageService.getStoreAreaVerifyDetail(this._reqParam).then(res => {
        this.store.dispatch({type: LOADINGCLOSE});
        if(utils.getStatusCode(res.code) == config.successCode){
          if(res.data){
            this._resData = res.data.areaVerifyDtoList;
            this._serviceName = res.data.serviceName;
            this._storesName = res.data.storesName;
            this._createTime = this.activatedRoute.snapshot.queryParamMap.get('createTime');
            let copyResData = utils.deepCopy(this._resData);
            for(let item of copyResData){
              let polygonObjDraw = this.amapService.polygonObjDraw(item.content,false,false);
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
              polygons: this.amapService.polygons
          });
        }else{
          this.message.create('error', res.message);
        }
      }).catch(err => {
        this.store.dispatch({type: LOADINGCLOSE});
        this.message.create('error', '网络加载失败');
      })
    })
    
  }

  goBack(){
    this.router.navigate(['/supplierManage/supplierAuditBusiness/supplierAuditBusinessBasic'],{queryParams: {from: 'detail'}})
  }

  

}
