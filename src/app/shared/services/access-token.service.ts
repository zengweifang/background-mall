import { Injectable } from '@angular/core';
import { service,config } from '../../core/core.config';
import { AjaxService } from './ajax.service';
import { utils } from '../utils/utils';
import { Router } from '@angular/router';
@Injectable()
export class AccessTokenService {
  public timer: any
  constructor(private ajaxService:AjaxService,private router:Router) { }
  getAccessToken(refresh_token){
    let self = this;
    var reqUrl = `${service.oauthUrl}/oauth/token?grant_type=refresh_token&client_id=${config.clientId}&client_secret=${config.clientSecret}&refresh_token=${refresh_token}`
    this.ajaxService.post(reqUrl).then(res => {
      utils.setLocalStorage("access_token",res.access_token)
      utils.setLocalStorage("expires_in",res.expires_in)
      utils.setLocalStorage("refresh_token",res.refresh_token)
      utils.setLocalStorage("oauth_update_time",String(new Date().getTime()))
    }).catch(err => {
      clearInterval(self.timer);
      self.router.navigate(['/login']);
    })
  }

  expiresTime(){
    let self = this;
    clearInterval(self.timer);
    this.timer = setInterval(function(){
      var expire = Number(utils.getLocalStorage('expires_in')) * 1000;
      var lastUpdate = utils.getLocalStorage("oauth_update_time");
      var now = new Date().getTime();
      // console.log('expiresTime')
        // console.log('现在时间和token最后更新时间差',parseInt(now) - parseInt(lastUpdate))
      // console.log('过期时间减去1分钟',parseInt(expire)-60000)
      if(now - parseInt(lastUpdate)  > expire - 60000){
        self.getAccessToken(utils.getLocalStorage('refresh_token'));
      }
      // self.getAccessToken(utils.getLocalStorage('refresh_token'));
    },10000);
  }

}
