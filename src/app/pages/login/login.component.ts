import { Component, OnInit } from '@angular/core';
import { Validators,FormBuilder,FormGroup,FormControlName } from '@angular/forms';
import { LoginService } from './login.service';
import { service,config } from '../../core/core.config';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { utils } from '../../shared/utils/utils';
import { Store } from "@ngrx/store";
import { LOGIN, LOGOUT } from "../../shared/reducer/login";
import { Observable } from 'rxjs/Observable';

interface AppState{
  login: boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // validateForm: FormGroup;
  public loginParam = {
    userName: '',
    password: ''
  }

  login: any;
  _loading: boolean = false;

  constructor(private fb:FormBuilder,
    private loginService:LoginService,
    private router:Router,
    private message:NzMessageService,
    private store: Store<AppState>,
  ) {
    this.login = store.select('login');
  }

  _submitForm(loginForm) {
    this._loading = true;
    utils.setSessionStorage('userName', this.loginParam.userName);
    this.loginService.login(this.loginParam.userName,this.loginParam.password).then(res => {
      this._loading = false;
      this.store.dispatch({type: LOGIN});
      this.router.navigate(['/']);
    }).catch(err => {
      this._loading = false;
      this.store.dispatch({type: LOGOUT});
      this.message.create('error', '登录失败');
    })
  }
  reset(){
    this.loginParam.userName = '';
    this.loginParam.password = '';
  }
  ngOnInit() {

  }

}
