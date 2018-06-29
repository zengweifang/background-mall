import { Component, OnInit } from '@angular/core';
import { NzMessageService,UploadFile } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { SupplierManageService } from '../../supplier-manage.service';
import { ValidatorService } from "../../../../core/validator.service";
import { CommonService } from '../../../../shared/services/common.service';
import { CustomModalService } from '../../../../shared/services/custom-modal.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-supplier-add-basic',
  templateUrl: './supplier-add-basic.component.html',
  styleUrls: ['./supplier-add-basic.component.scss']
})
export class SupplierAddBasicComponent implements OnInit {
  _current:number = 0
  _findType: any[] = []
  _ownList:any = [{id:true,name:'自营'},{id:false,name:'非自营'}];
  _supplierManagerAddForm: FormGroup
  _provinces: any[] = [];
  _cities: any[] = [];
  _scenicspots: any[] = [];
  _reqParam:any = {
    username: '',
    serviceName: '',
    serviceTypeIds: [],
    isOwn: false,
    name: '',
    tel: '',
    phone: '',
    idCard: '',
    qq: '',
    email: '',
    receiverPhone: '',
    address: '',
    postalCode: '',
    province: '',
    city: '',
    district: '',
    businessLicenseImgs: [],
    logoImg: ''
  }
  _saveLoading: boolean = false
  _uploadUrl:string = service.uploadUrl;
  _fileLicenseList: any[] = []
  _fileLogoList: any[] = []
  _previewImage:string = '';
  _previewVisible:boolean = false;
  _canDeactivate: boolean = false;
  constructor(private fb: FormBuilder,private message: NzMessageService,public customModalService: CustomModalService,private supplierManageService: SupplierManageService,private router:Router,private validatorService: ValidatorService,private commonService:CommonService) {
    
  }
  ngOnInit() {
    this._supplierManagerAddForm = this.fb.group({
      username: ['',this.validatorService.accountValidator],
      serviceName: ['',this.validatorService.serviceNameValidator],
      serviceType: ['', Validators.required],
      own: ['', Validators.required],
      name: ['', this.nameValidator],
      tel: ['',this.validatorService.telValidator],
      phone: ['',this.validatorService.phoneValidator],
      idCard: ['',this.validatorService.idCardValidator],
      qq: ['',this.validatorService.qqValidator],
      email: ['',this.validatorService.emailValidator],
      receiverPhone: ['',this.receiverPhoneValidator],
      adcode: [[],Validators.required],
      address: ['',this.validatorService.addressValidator],
      postalCode: ['',this.validatorService.postalCodeValidator]
    });
    this.getData();
  }

  _submitForm(){
    this._saveLoading = true;
    let postalCodeValue = this._supplierManagerAddForm.get('adcode').value;
    this._reqParam.province = postalCodeValue[0];
    this._reqParam.city = postalCodeValue[1];
    this._reqParam.district = postalCodeValue[2];
    this._reqParam.serviceTypeIds = [];
    this._reqParam.serviceTypeIds.push(this._supplierManagerAddForm.get('serviceType').value);
    this.supplierManageService.create(this._reqParam).then(res => {
      this._saveLoading = false;
      let _self = this;
      if(utils.getStatusCode(res.code) == config.successCode){
        this.customModalService._confirm({
          title:'保存成功！',
          content: '是否马上设置经营范围？',
          okText: '现在设置',
          cancelText: '以后再说',
          onOk(){
            _self._canDeactivate = true;
            _self.router.navigate(['/supplierManage/supplierAdd/addSupplierOperate',res.data],{queryParams: {from: 'add'}})
          },
          onCancel(){
            _self._canDeactivate = true;
            _self.router.navigate(['/supplierManage/supplierList/supplierList'])
          },

        });
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      console.log(err)
      this._saveLoading = false;
      this.message.create('error', '网络加载失败');
    })
  }
  //获取服务类型
  getData(){
    this.supplierManageService.supplierFindAll().then(res => {
      if(utils.getStatusCode(res.code) == config.successCode){
        this._findType = res.data ? res.data : [];
        setTimeout(() => {
          this._supplierManagerAddForm.patchValue({
            serviceType: 'b32becb5-604c-4f7c-8f71-5b5ea6364dfa',
            own: false
          })
        },0)
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      console.log(err)
      this.message.create('error', '网络加载失败');
    })
  }
  //获取所有省
  getAllRegion(param):Promise<any>{
    return new Promise((resolve,reject) => {
      this.commonService.getAllRegion(param).then(res => {
        if(utils.getStatusCode(res.code) == config.successCode){
          res.data ? resolve(res.data): reject('err')
        }else{
          this.message.create('error', res.message);
          reject('err')
        }
      }).catch(err => {
        console.log(err);
        this.message.create('error', '网络加载失败');
        reject(err)
        
      })
    })
    
  }

  getFormControl(name){
      return this._supplierManagerAddForm.controls[name];
  }

  // 处理未保存的更改  路由守卫
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    // observable  貌似不行  Promise<boolean> | boolean 可以
    if ((!this._reqParam.username && !this._reqParam.serviceName && !this._reqParam.name && !this._reqParam.tel && !this._reqParam.phone && !this._reqParam.idCard && !this._reqParam.qq && !this._reqParam.email && !this._reqParam.receiverPhone && !this._reqParam.address && !this._reqParam.postalCode && this._supplierManagerAddForm.get('adcode').value.length == 0 && this._fileLicenseList.length == 0 && this._fileLogoList.length == 0) || this._canDeactivate){
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

  /** load data async */
  loadData(e: {option: any, index: number, resolve: Function, reject: Function}): void {
    if (e.index === -1) {
      this.getAllRegion({}).then(res => {
        this._provinces = res;
        e.resolve(this._provinces);
      }).catch(err => {
        console.log(err)
        this._provinces = [];
      })
      return;
    }
    const option = e.option;
    option.loading = true;
    if (e.index === 0) {
      this.getAllRegion({parentId: option.id}).then(res => {
        option.loading = false;
        this._cities = res
        e.resolve(this._cities);
      }).catch(err => {
        console.log(err)
        option.loading = false;
        this._cities = [];
      })
    }
    if (e.index === 1) {
      this.getAllRegion({parentId: option.id}).then(res => {
        option.loading = false;
        this._scenicspots = res;
        e.resolve(this._scenicspots);
      }).catch(err => {
        console.log(err)
        option.loading = false;
        this._scenicspots = [];
      })
    }

    if (e.index === 2) {
      option.loading = false;
    }
  }

  handlePreview = (file: UploadFile) => {
    this._previewImage = file.url || file.thumbUrl;
    this._previewVisible = true;
  }

  licenseLoadChange(value){
    console.log(value)
    if(value.file.status === 'done' || value.file.status === 'removed'){
      this._reqParam.businessLicenseImgs = [];
      for(let item of value.fileList){
        this._reqParam.businessLicenseImgs.push(item.response.name)
      }
    }
    // 如果为error时 看情况处理最后一个文件
  }

  logoLoadChange(value){
    if(value.file.status === 'done' || value.file.status === 'removed'){
      if(value.fileList.length > 0){
        this._reqParam.logoImg = value.fileList[0].response.name;
      }else{
        this._reqParam.logoImg = ''
      }
    }
  }

  goBack(){
    this.router.navigate(['/supplierManage/supplierList/supplierList'])
  }

  // 验证器
  // 姓名
  nameValidator = (control: FormControl): { [s: string]: boolean } => {
      const NAME_REGEXP = /^[\u4e00-\u9fa5a-zA-Z]{2,16}$/;
      if (!control.value) {
          return { required: true }
      } else if (!NAME_REGEXP.test(control.value)) {
          return { error: true, name: true };
      }
  };

  // 接受订单手机号
  receiverPhoneValidator = (control: FormControl): { [s: string]: boolean } => {
      const RECEIVERPHONE_REGEXP = /^[\S]{11,119}$/;
      if (!control.value) {
          return { required: true }
      } else if (!RECEIVERPHONE_REGEXP.test(control.value)) {
          return { error: true, receiverPhone: true };
      }
  };

}
