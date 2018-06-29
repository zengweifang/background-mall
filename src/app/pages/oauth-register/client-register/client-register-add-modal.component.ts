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
  templateUrl: './client-register-add-modal.component.html',
  styleUrls: ['./client-register-add-modal.component.css']
})
export class ClientRegisterAddModalComponent implements OnInit {
  validateForm: FormGroup;

  _name: string;
  isLoading = false;

  grantTypes = [];
  resourceList = [];
  authorityList = [];

  grantTypesOptions = [];
  resourceOptions = [];
  authorityOptions = [];

  isNeedCallbackURL = false;
  selectedGrantTypes = [];

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
      name: [null, [Validators.required]],
      authorizedGrantTypes: [this.grantTypesOptions, [Validators.required]],
      resourceIds: [this.resourceOptions, [Validators.required]],
      scope: [[
        { label: '读', value: 'read', checked: true },
        { label: '写', value: 'write', checked: true },
      ], [Validators.required]],
      authorities: [this.authorityOptions, [Validators.required]],
      webServerRedirectUri: [null, [ this.isNeedCallbackURL ? Validators.required : Validators.nullValidator]],
      accessTokenValidity: [86400,],
      refreshTokenValidity: [2592000,],
      additionalInformation: [null,],
      accessTokenValautoapprovedity: [false,],
    });
    this._getGrantTypes();
    this._getResourceList();
    this._getAuthorityList();
  }

  @Input()
  set name(value: string) {
    this._name = value;
  }

  /* event response */
  handleCancel(e) {
    this.subject.destroy('onCancel');
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
      parameter.autoapprove = [(this.validateForm.controls['accessTokenValautoapprovedity'] && this.validateForm.controls['accessTokenValautoapprovedity'].value) ? true : false];

      this.oauthRegisterService.registerClient(parameter).then(resp => {
        this.isLoading = false;
        if (!this.codeHelperService.isServerError(resp)) {
          this.message.create('success', '操作成功');
          this.subject.destroy('onOk');
        } else {
          this.message.create('error', resp.message ? resp.message : '注册失败');
        }
      }).catch(error => {
        this.isLoading = false;
        this.message.create('error', '注册失败');
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
    this.oauthRegisterService.getGrantTypes({}).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.grantTypes = resp.data;
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
      } else {
        this.message.create('error', '认证方式获取失败');
      }
    }).catch(error => {
      this.message.create('error', '认证方式获取失败');
    })
  }

  _getResourceList() {
    this.oauthRegisterService.getOAuthResourseList(null).then(resp => {
      if (!this.codeHelperService.isServerError(resp)) {
        this.resourceList = resp.data.list;
        if(this.resourceList.length > 0) {
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
        if(this.authorityList.length > 0) {
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