import { Component, OnInit } from '@angular/core';
import { NzMessageService,UploadFile } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { SupplierManageService } from '../../supplier-manage.service';
import { ValidatorService } from "../../../../core/validator.service";
import { CommonService } from '../../../../shared/services/common.service';
import { CustomModalService } from '../../../../shared/services/custom-modal.service';
import { Store } from "@ngrx/store";
import { LOADINGOPEN, LOADINGCLOSE } from "../../../../shared/reducer/page-load";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
@Component({
  selector: 'app-supplier-edit-basic',
  templateUrl: './supplier-edit-basic.component.html',
  styleUrls: ['./supplier-edit-basic.component.scss']
})
export class SupplierEditBasicComponent implements OnInit {
  _id: string = ''
  _from : string = ''
  _adcodeChange: boolean = false
  _findType: any[] = []
  _ownList:any = [{id:true,name:'自营'},{id:false,name:'非自营'}]
  _supplierManagerEditForm: FormGroup
  _provinces: any[] = []
  _cities: any[] = []
  _scenicspots: any[] = []
  _oldBaseInfo: any
  _baseInfo = {
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
  _updateLoading: boolean = false
  _uploadUrl:string = service.uploadUrl
  _fileLicenseList: any[] = []
  _fileLogoList: any[] = []
  _previewImage:string = ''
  _previewVisible:boolean = false
  _canDeactivate: boolean = false;
  _isBackOrCancel: string = '返回'
  constructor(private fb: FormBuilder,private message: NzMessageService,private customModalService: CustomModalService,private supplierManageService: SupplierManageService,private router:Router,private validatorService: ValidatorService,private commonService:CommonService,private activatedRoute:ActivatedRoute,private store: Store<AppState>) {
    this._id = this.activatedRoute.snapshot.paramMap.get('id');
    this._from = this.activatedRoute.snapshot.queryParamMap.get('from');
  }

  ngOnInit() {
    this._supplierManagerEditForm = this.fb.group({
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
      adcode: [null,Validators.required],
      address: ['',this.validatorService.addressValidator],
      postalCode: ['',this.validatorService.postalCodeValidator]
    });
    this.getData();
    this.getProvider();
  }

  getProvider(){
    this.store.dispatch({type: LOADINGOPEN});
    this.supplierManageService.getProviderById(this._id).then(res => {
      this.store.dispatch({type: LOADINGCLOSE});
      console.log(res.data)
      if(utils.getStatusCode(res.code) == config.successCode){
        if(res.data){
          this._oldBaseInfo = res.data;
          this._baseInfo = utils.deepCopy(res.data);
          this._supplierManagerEditForm.patchValue({
            serviceType: res.data.serviceTypes[0].id,
            adcode: [res.data.provinceName,res.data.cityName,res.data.districtName],
          })
          this._baseInfo.province = res.data.province;
          this._baseInfo.city = res.data.city;
          this._baseInfo.district = res.data.district;
          let arr = [];
          let arrOne  = [];
          for(let i = 0 , len = res.data.businessLicenseImgs.length; i < len ; i ++){
            arr.push({
              name: res.data.businessLicenseImgs[i],
              status: 'done',
              url: `${service.uploadReturnUrl}110/${res.data.businessLicenseImgs[i]}`,
              thumbUrl: `${service.uploadReturnUrl}110/${res.data.businessLicenseImgs[i]}`,
            });
            if(i == 0){
              arrOne.push({
                name: res.data.logoImg,
                status: 'done',
                url: `${service.uploadReturnUrl}110/${res.data.logoImg}`,
                thumbUrl: `${service.uploadReturnUrl}110/${res.data.logoImg}`,
              });
            }
          }
          this._fileLicenseList = [...arr];
          this._fileLogoList = [...arrOne];

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

  _update(){
    this._updateLoading = true;
    if(this._adcodeChange){
      let postalCodeValue = this._supplierManagerEditForm.get('adcode').value;
      this._baseInfo.province = postalCodeValue[0];
      this._baseInfo.city = postalCodeValue[1];
      this._baseInfo.district = postalCodeValue[2];
    }
    this._baseInfo.serviceTypeIds = [];
    this._baseInfo.serviceTypeIds.push(this._supplierManagerEditForm.get('serviceType').value);
    this.supplierManageService.update(this._baseInfo).then(res => {
      this._updateLoading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        this.message.create('success', '保存成功！');
        this._canDeactivate = true;
        if(this._from === 'check'){
          this.router.navigate(['/supplierManage/supplierCheck/checkSupplierBasic',this._id])
        }else{
          this.router.navigate(['/supplierManage/supplierList/supplierList'])
        }
        
      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      console.log(err)
      this._updateLoading = false;
      this.message.create('error', '网络加载失败');
    })
  }

  _cancel(){
    this._isBackOrCancel = '取消';
    if(this._from === 'check'){
      this.router.navigate(['/supplierManage/supplierCheck/checkSupplierBasic',this._id])
    }else{
      this.router.navigate(['/supplierManage/supplierList/supplierList'])
    }
  }
  //获取服务类型
  getData(){
    this.supplierManageService.supplierFindAll().then(res => {
      if(utils.getStatusCode(res.code) == config.successCode){
        this._findType = res.data ? res.data : [];
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

  // 处理未保存的更改  路由守卫
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    // observable  貌似不行  Promise<boolean> | boolean 可以
    if ((this._baseInfo.serviceName === this._oldBaseInfo.serviceName && this._supplierManagerEditForm.get('serviceType').value === this._oldBaseInfo.serviceTypes[0].id && this._baseInfo.isOwn === this._oldBaseInfo.isOwn && this._baseInfo.name === this._oldBaseInfo.name && this._baseInfo.tel === this._oldBaseInfo.tel && this._baseInfo.idCard === this._oldBaseInfo.idCard && this._baseInfo.qq === this._oldBaseInfo.qq && this._baseInfo.email === this._oldBaseInfo.email && this._baseInfo.receiverPhone === this._oldBaseInfo.receiverPhone && this._baseInfo.address === this._oldBaseInfo.address && this._baseInfo.postalCode === this._oldBaseInfo.postalCode) || this._canDeactivate){
        return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    
    return new Promise(resolve => {
      this.customModalService._confirm({
        title:'温馨提示',
        content: `如果确认${this._isBackOrCancel}，刚编辑的信息不会被保存`,
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



  getFormControl(name){
      return this._supplierManagerEditForm.controls[name];
  }

  adcodeChange(value){
    this._adcodeChange = true;
  }

  /** load data async */
  loadData(e: {option: any, index: number, resolve: Function, reject: Function}): void {
    console.log(e)
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
    console.log(this._fileLicenseList);
    if(value.file.status === 'done' || value.file.status === 'removed'){
      this._baseInfo.businessLicenseImgs = [];
      for(let item of value.fileList){
        if(item.response){
          this._baseInfo.businessLicenseImgs.push(item.response.name)
        }else{
          this._baseInfo.businessLicenseImgs.push(item.name)
        }
        
      }
    }
    // 如果为error时 看情况处理最后一个文件
    
  }

  logoLoadChange(value){
    if(value.file.status === 'done' || value.file.status === 'removed'){
      if(value.fileList.length > 0){
        if(value.fileList[0].response){
          this._baseInfo.logoImg = value.fileList[0].response.name;
        }else{
          this._baseInfo.logoImg = value.fileList[0].name;
        }
        
      }else{
        this._baseInfo.logoImg = ''
      }
    }
  }

  goBack(){
    this._isBackOrCancel = '返回';
    console.log(this._from)
    if(this._from === 'check'){
      this.router.navigate(['/supplierManage/supplierCheck/checkSupplierBasic',this._id])
    }else{
      this.router.navigate(['/supplierManage/supplierList/supplierList'])
    }
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
