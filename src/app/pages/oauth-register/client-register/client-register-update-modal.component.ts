import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { OauthRegisterService } from '../oauth-register.service';
import { NzMessageService } from 'ng-zorro-antd';
import { CodeHelperService } from "../../../core/code-helper.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { error } from 'util';


@Component({
  selector: 'nz-demo-component',
  templateUrl: './client-register-update-modal.component.html',
  styleUrls: ['./client-register-update-modal.component.css']
})
export class ClientRegisterUpdateModalComponent implements OnInit {
  validateForm: FormGroup;

  _data: any = {};
  _isDetail: boolean = false;
  isLoading = false;

  grantTypes = [];
  resourceList = [];
  authorityList = [];

  grantTypesOptions = [];
  resourceOptions = [];
  authorityOptions = [];

  isNeedCallbackURL = false;
  _name = '';
  selectedGrantTypes = [];
  selectedResources = [];
  selectedAuthorities = [];
  _scope = [{ label: '读', value: 'read', checked: false },
  { label: '写', value: 'write', checked: false }];
  _callbackURL = '';
  _accessTokenValidity = 86400;
  _refreshTokenValidity = 2592000;
  _additionalInformation = '';
  _autoapprove = false;

  constructor(
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private oauthRegisterService: OauthRegisterService,
    private message: NzMessageService,
    private codeHelperService: CodeHelperService,
  ) { }

  /* lifecycle */
  ngOnInit() {
    
    this.validateForm = this.fb.group({
      clientId: [this._data.clientId, [Validators.required]],
      name: [null, [Validators.required]],
      authorizedGrantTypes: [this.grantTypesOptions, [Validators.required]],
      resourceIds: [this.resourceOptions, [Validators.required]],
      scope: [[
        { label: '读', value: 'read', checked: true },
        { label: '写', value: 'write', checked: true },
      ], [Validators.required]],
      authorities: [this.authorityOptions, [Validators.required]],
      webServerRedirectUri: [null, [this.isNeedCallbackURL ? Validators.required : Validators.nullValidator]],
      accessTokenValidity: [86400,],
      refreshTokenValidity: [2592000,],
      additionalInformation: [null,],
      accessTokenValautoapprovedity: [false,],
    });
    this._getGrantTypes();
    this._getResourceList();
    this._getAuthorityList();
    this._name = this._data.name;
    this.selectedGrantTypes = this._data.authorizedGrantTypes;
    this.selectedResources = this._data.resourceIds;
    this.selectedAuthorities = this._data.authorities.map(item => item.replace('ROLE_', ''));
    for (const item in this._data.scope) {
      if (this._data.scope.hasOwnProperty(item)) {
        const element = this._data.scope[item];
        for (const item2 in this._scope) {
          if (this._scope.hasOwnProperty(item2)) {
            const element2 = this._scope[item2];
            if (element2.value === element) {
              element2.checked = true;
            }
          }
        }
      }
    }
    this._callbackURL = (this._data.webServerRedirectUri && this._data.webServerRedirectUri.length) ? this._data.webServerRedirectUri[0] : '';
    this._accessTokenValidity = this._data.accessTokenValidity;
    this._refreshTokenValidity = this._data.refreshTokenValidity;
    this._additionalInformation = this._data.additionalInformation;
    this._autoapprove = (this._data.autoapprove && this._data.autoapprove.length) ? this._data.autoapprove[0] : false;

  }

  @Input()
  set data(value: any) {
    this._data = value;
  }
  set isDetail(value: boolean) {
    this._isDetail = value;
  }

  /* event response */
  handleCancel(e) {
    this.subject.destroy('onCancel');
  }

  editModel($event) {
    this._isDetail = false;
  }

  _submitForm($event, value) {
    $event.preventDefault();

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    if (this.validateForm.valid) {
      this.isLoading = true;
      let parameter = value;
      let tmpScope = [];
      for (const item in value.scope) {
        if (value.scope.hasOwnProperty(item)) {
          const element = value.scope[item];
          if (element.checked) {
            tmpScope.push(element.value);
          }
        }
      }
      parameter.scope = tmpScope;
      parameter.authorizedGrantTypes = this.selectedGrantTypes;
      if (value.webServerRedirectUri) {
        parameter.webServerRedirectUri = [value.webServerRedirectUri];
      }
      parameter.autoapprove = [this._autoapprove ? true : false];

      this.oauthRegisterService.updateClient(parameter).then(resp => {
        this.isLoading = false;
        this.message.create('success', '操作成功');
        this.subject.destroy('onOk');
      }).catch(error => {
        this.isLoading = false;
        this.message.create('error', '网络连接失败');
      });
    }
  }

  authorizedGrantTypesChange($event) {
    // 如果选择授权码模式 则回调URL必填
    this.isNeedCallbackURL = this.selectedGrantTypes.indexOf('authorization_code') > -1;
  }

  getFormControl(name) {
    return this.validateForm.controls[name];
  }

  /* private methods */
  _getGrantTypes() {
    this.oauthRegisterService.getGrantTypes({}).then(data => {
      this.grantTypes = data.data;
      if (this.grantTypes.length > 0) {
        for (const item in this.grantTypes) {
          if (this.grantTypes.hasOwnProperty(item)) {
            const element = this.grantTypes[item];
            this.grantTypesOptions.push({
              'value': element.name,
              'label': element.value,
            })
          }
        }
      }
    }).catch(error => {
      this.message.create('error', '认证方式获取失败');
    })
  }

  _getResourceList() {
    this.oauthRegisterService.getOAuthResourseList(null).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.resourceList = resp.data.list;
        if (this.resourceList.length > 0) {
          for (const item in this.resourceList) {
            if (this.resourceList.hasOwnProperty(item)) {
              const element = this.resourceList[item];
              this.resourceOptions.push({
                'value': element.name,
                'label': element.alias,
              })
            }
          }
        }
      } else {
        this.message.create('error', '访问资源获取失败');
      }
    }).catch(error => {
      this.message.create('error', '访问资源获取失败');
    })
  }

  _getAuthorityList() {
    this.oauthRegisterService.getAuthorityList(null).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.authorityList = resp.data;
        if (this.authorityList.length > 0) {
          for (const item in this.authorityList) {
            if (this.authorityList.hasOwnProperty(item)) {
              const element = this.authorityList[item];
              this.authorityOptions.push({
                'value': element.name,
                'label': element.value
              })
            }
          }
        }
      } else {
        this.message.create('error', '角色权限获取失败');
      }
    }).catch(error => {
      this.message.create('error', '角色权限获取失败');
    })
  }

  _checkLoadedSuccess() {
    return this.grantTypes.length > 0 && this.resourceList.length > 0 && this.authorityList.length > 0;
  }

  disableSubmit() {
    var flag = false;
    flag = !this.validateForm.valid;
    if (!this._checkLoadedSuccess()) {
      return true;
    }
    if (this.isNeedCallbackURL) {
      if (this.validateForm.controls['webServerRedirectUri'].value) {
        return flag;
      } else {
        return true;
      }
    } else {
      return flag;
    }
  }

}