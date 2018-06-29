import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { utils } from '../../../../shared/utils/utils';
import { config, service } from '../../../../core/core.config';
import { CustomModalService } from '../../../../shared/services/custom-modal.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { SpTemplatesAddModalComponent } from './sp-templates-add-modal/sp-templates-add-modal.component';
import { SpTemplatesAddService } from './sp-templates-add.service';
@Component({
  selector: 'app-sp-templates-add',
  templateUrl: './sp-templates-add.component.html',
  styleUrls: ['./sp-templates-add.component.scss']
})
export class SpTemplatesAddComponent implements OnInit {
  _storeManagerSPTemplatesAddForm: FormGroup
  _providerId = utils.getSessionStorage('userId');
  _storeId: string = '';
  _reqParam = {
    templateName: '',
    freeDeliveryMode: 1,
    freightMode: 1,
    deliveryChecked: false,
    freeChecked: false,
    storeId: '',
    freightList: [],//快递
    freeDeliveryConditions: [],
    serviceProviderId: this._providerId
  }

  //默认运费
  _defaultExpressFreight={
    isDefault:true,
    deliveryType:4,
    firstArticle:1,
    firstArticleFreight:0.00,
    firstWeight:1.00,
    firstWeightFreight:0.00,
    addArticle:1,
    addArticleFreight:0.00,
    addWeight:1.00,
    addWeightFreight:0.00
  };


  _ownList=[{id:1,name:'自定义运费'},{id:2,name:'卖家承担运费'}];
  _typeList=[{id:1,name:'按件数'}];
  _saveLoading: boolean = false


  constructor(private fb: FormBuilder,private message: NzMessageService,public customModalService: CustomModalService,private router:Router,private notificationService: NzNotificationService,private activatedRoute:ActivatedRoute,private spTemplatesAddService: SpTemplatesAddService) {
    this._storeId = this.activatedRoute.snapshot.paramMap.get('id');
    this._reqParam.storeId = this._storeId;
  }

  ngOnInit() {
    this._storeManagerSPTemplatesAddForm = this.fb.group({
      templateName: ['',this.templateNameValidator],
      freeDeliveryMode: [null,Validators.required],
      freightMode: [null,Validators.required],
      defalutFirstArticle: [1,this.oneValidator],
      defaultFirstArticleFreight: [0.00,this.twoValidator],
      defaultAddArticle: [1,this.oneValidator],
      defaultAddArticleFreight: [0.00,this.twoValidator],
      freightList: this.fb.array([]),
      freeDeliveryConditions: this.fb.array([])
    });
    
  }


  getFormControl(name){
    return this._storeManagerSPTemplatesAddForm.controls[name];
  }

  deliveryCheckedChange(e){

  }
  //+为指定区域设置运费
  newFreight(){
    this.freightList.push(this.fb.group({
      firstArticle: [1,this.oneValidator],
      firstArticleFreight: [0.00,this.twoValidator],
      addArticle: [1,this.oneValidator],
      addArticleFreight: [0.00,this.twoValidator],
      freightRegionDtoList: [[]]
    }));
    
  }

  addFree(){
    this.freeDeliveryConditions.push(this.fb.group({
      count: [1,this.oneValidator],
      amount: [0.00,this.twoValidator],
      deliveryType: [4],
      conditionOption: [1],
      freightRegionDtoList: [[]]
    }));
    
  }

  freightModal(item,data){
    this.customModalService._content({
      title:'设置配送区域',
      content: SpTemplatesAddModalComponent,
      width: 400,
      componentParams: {
        item: item,
        data: data
      },
      onOk(){
      }
    });
  }

  delFreight(index){
    this.freightList.removeAt(index);
  }

  delFreeDeliveryConditions(index){
    this.freeDeliveryConditions.removeAt(index);
  }

  //保存运费模版
  createTemplate(){
    
    this._reqParam.freightList.push(this._defaultExpressFreight);

    for(let item of this.freightList.controls){
      
      this._reqParam.freightList.push({
        freightRegionDtoList: item.get('freightRegionDtoList').value,
        firstArticle: parseFloat(item.get('firstArticle').value),
        firstArticleFreight: parseFloat(item.get('firstArticleFreight').value),
        addArticle: parseFloat(item.get('addArticle').value),
        addArticleFreight: parseFloat(item.get('addArticleFreight').value),
        firstWeight:1.00,
        firstWeightFreight:0.00,
        addWeight:1.00,
        addWeightFreight:0.00,
        deliveryType:4,
        isDefault:false
      })
    }

    for(let item of this.freeDeliveryConditions.controls){
      
      this._reqParam.freeDeliveryConditions.push({
        freightRegionDtoList: item.get('freightRegionDtoList').value,
        amount: item.get('amount').value,
        count: parseFloat(item.get('count').value),
        deliveryType: parseFloat(item.get('deliveryType').value),
        conditionOption: parseFloat(item.get('conditionOption').value),
        weight:1.00,
        freightMode:1,
      })

    }
    this._saveLoading = true;
    this.spTemplatesAddService.createTemplate(this._reqParam).then( res => {
      this._saveLoading = false;
      if(utils.getStatusCode(res.code) == config.successCode){
        this.notificationService.create('success',res.message,'');

      }else{
        this.message.create('error', res.message);
      }
    }).catch(err => {
      this._saveLoading = false;
      this.message.create('error', '网络加载失败');
    })
    
  }

  get freightList(): FormArray {
    return this._storeManagerSPTemplatesAddForm.get('freightList') as FormArray;
  };

  get freeDeliveryConditions(): FormArray {
    return this._storeManagerSPTemplatesAddForm.get('freeDeliveryConditions') as FormArray;
  };


   // 验证器
  // 运费模版名称
  templateNameValidator = (control: FormControl): { [s: string]: boolean } => {
    const TEMPLATENAME_REGEXP = /^\S{2,25}$/;
    if (!control.value) {
        return { required: true }
    } else if (!TEMPLATENAME_REGEXP.test(control.value)) {
        return { error: true, templateName: true };
    }
  };

  oneValidator = (control: FormControl): { [s: string]: boolean } => {
    const REGEXP = /^[1-9]\d{0,3}$/;
    if (control.value == null || control.value == undefined) {
        return { required: true }
    } else if (!REGEXP.test(control.value)) {
        return { error: true, one: true };
    }
  };

  twoValidator = (control: FormControl): { [s: string]: boolean } => {
    const REGEXP = /^(0$|([1-9]\d{0,3}$)|0\.\d{1,2}$|([1-9]\d{0,3}\.\d{1,2}))$/;
    if (control.value == null || control.value == undefined) {
        return { required: true }
    } else if (!REGEXP.test(control.value)) {
        return { error: true, two: true };
    }
  };



}
