import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzNotificationService,NzModalSubject} from 'ng-zorro-antd';
import { SupplierManageService } from '../../../pages/supplier-manage/supplier-manage.service';
import { utils } from '../../utils/utils';
import { config, service } from '../../../core/core.config';
import { AmapService } from '../../services/amap.service';
@Component({
  selector: 'app-fail-reason',
  templateUrl: './fail-reason.component.html',
  styleUrls: ['./fail-reason.component.scss']
})
export class FailReasonComponent implements OnInit {
  _reason: string = '';
  _loading: boolean = false;
  constructor(private message: NzMessageService,private amapService: AmapService,private notificationService: NzNotificationService,private supplierManageService: SupplierManageService,private modalSubject: NzModalSubject) { }

  ngOnInit() {
  }

  _submitForm(){
    this._loading = true;
    let reqParam = {
        refuseAreaInfoList: [{
            verifyId: this.amapService.selectRadio.id,
            reason: this._reason
        }],
        verifyUserId: window.sessionStorage.getItem("userId"),
    }
    this.supplierManageService.notPass(reqParam).then(res => {
      this._loading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        this.modalSubject.destroy('onCancel');
        this.notificationService.create('success',res.message,'');
        this.amapService.selectRadio.id = "";
        utils.setSessionStorage('supplierAuditBusinessBasicInitTab','failure')
        this.amapService.pageThis.refreshData();
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this._loading = false;
      this.message.create('error', '网络加载失败');
    })
  }


}
