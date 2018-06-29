import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { SupplierManageService } from '../../supplier-manage.service';
import { NzMessageService, NzModalService} from 'ng-zorro-antd';
import { utils } from '../../../../shared/utils/utils';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { config, service } from '../../../../core/core.config';
import { ValidatorService } from "../../../../core/validator.service";
@Component({
  selector: 'app-supplier-add-finance',
  templateUrl: './supplier-add-finance.component.html',
  styleUrls: ['./supplier-add-finance.component.scss']
})
export class SupplierAddFinanceComponent implements OnInit {
  _current:number = 2
  _id: string = ''
  _isEdit: number = 0
  _data = {
    serviceName: '',
    username: '',
    serviceTypes: [1],
    phone: '',
    createTime: null,
    status: 0
  }
  _supplierManagerAddFinanceForm: FormGroup
  constructor(private supplierManageService: SupplierManageService,private message: NzMessageService,private modalService:NzModalService,private router: Router,private activatedRoute:ActivatedRoute,private fb: FormBuilder,private validatorService: ValidatorService) {
    this._id = this.activatedRoute.snapshot.paramMap.get('id');
    this._isEdit = Number(this.activatedRoute.snapshot.queryParamMap.get('status'));
    this._data = utils.getSessionStorage('providerInfo');
  }

  ngOnInit() {
    this._supplierManagerAddFinanceForm = this.fb.group({
      bankName: ['',this.validatorService.accountValidator],
      bankNum: ['',this.validatorService.serviceNameValidator],
      serviceType: ['', Validators.required],
      own: ['', Validators.required],
      name: ['',],
      tel: ['',this.validatorService.telValidator],
      phone: ['',this.validatorService.phoneValidator],
      idCard: ['',this.validatorService.idCardValidator],
      qq: ['',this.validatorService.qqValidator],
      email: ['',this.validatorService.emailValidator],
      receiverPhone: [''],
      adcode: [null,Validators.required],
      address: ['',this.validatorService.addressValidator],
      postalCode: ['',this.validatorService.postalCodeValidator]
    });
  }

  getFormControl(name){
    return this._supplierManagerAddFinanceForm.controls[name];
  }

  goBack(){

  }

}
