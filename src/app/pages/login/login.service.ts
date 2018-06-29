import { Injectable } from '@angular/core';
import { service,config } from '../../core/core.config';
import { AjaxService } from '../../shared/services/ajax.service';
import { AccessTokenService } from '../../shared/services/access-token.service';
import { utils } from '../../shared/utils/utils';
@Injectable()
export class LoginService {

  constructor(private ajaxService:AjaxService,private accessTokenService:AccessTokenService) { }

  login(userName,password):Promise<any>{
    let reqUrl = `${service.commonService}/background-manage/login/login`;
    let param = {
      'userName':userName,
      'password':password,
      'clientId':config.clientId, 
      'clientSecret': config.clientSecret
    }
    return new Promise((resolve,reject) =>{
      this.ajaxService.post(reqUrl,param).then(res => {
        if(utils.getStatusCode(res.code) == config.successCode){
          utils.setSessionStorage("authToken",res.data.authToken);
          utils.setSessionStorage("userId",res.data.userId)
          if(res.data.channels){
            utils.setSessionStorage("channelInfo",JSON.stringify(res.data.channels[0]))
          }
          //用户登录之后返回access_token,保存到localStorage
          utils.setLocalStorage("access_token",res.data.access_token)
          utils.setLocalStorage("expires_in",res.data.expires_in)
          utils.setLocalStorage("refresh_token",res.data.refresh_token)
          utils.setLocalStorage("oauth_update_time",String(new Date().getTime()))
          //启动定时器
          setTimeout(this.accessTokenService.expiresTime(), 1000);
          // ordersPromptingService.getOrdersNums();
  
          //保存是否有子渠道
          if(res.data.channels!=undefined){
            utils.setSessionStorage("hasChildren",res.data.channels[0].hasChildren)
          }
          resolve(res);
        } else {
          reject(res);
        }
        
      }).catch(err => {
        reject(err);
      })
    });
  }
}
