import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpClient } from '@angular/common/http';
import { AccessTokenService } from '../shared/services/access-token.service';
import { AjaxService } from '../shared/services/ajax.service';
import { Observable } from 'rxjs/Observable';
import { utils } from "../shared/utils/utils";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import { Store } from "@ngrx/store";
import { LOGIN, LOGOUT } from "../shared/reducer/login";

interface AppState {
	login: boolean;
}

/**
 * TOKEN拦截器
 * 默认在 `ng-alain` 未注册，若开启需要在相应的模块中注册（建议在根或Core模块中注册）
 * ```typescript
 *  @NgModule({
 *      providers: [ { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true} ]
 *  })
 * ```
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private store:Store<AppState>
  ) {

  }
  private goLogin() {
    this.store.dispatch({type: LOGOUT});
    this.injector.get(Router).navigate(['/login']);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    // 过滤授权请求
    // if (req.url.includes('/auth')) return next.handle(req);
    // return next.handle(req)
    // 可以进一步处理，比如：重新刷新或重新登录
    let tokenReq;
    let authToken = utils.getSessionStorage("authToken");
    if (!authToken) {
      this.goLogin();
      return next.handle(req);
    }



    let access_token = utils.getLocalStorage('access_token')
    if (req.url.split('oauth-service')[1] != '/oauth/rest_token' && req.url.split('background-manage')[1] != '/login/login') {
      if (!access_token) {
        this.goLogin();
        return next.handle(req);
      } else {
        this.injector.get(AccessTokenService).expiresTime()
        tokenReq = req.clone({
          // 正常token值放在请求header当中，具体格式以后端为准
          headers: req.headers.set('Authorization', `Bearer ${access_token}`),
          withCredentials: true
        });
        // return next.handle(tokenReq).do(event => { }).catch(err => {
        //     if (err["status"]) {
        //       if (err.status === 401) {
        //         console.log('token 失效');
        //         utils.removeLocalStorage("authToken")
        //         utils.clearLocalStorage();
        //         this.goLogin();
        //       }
        //     }
        //     return Observable.throw(err);
        //  });
      }
    } else {
      return next.handle(req);
    }
    // .mergeMap((event: any) => {
    //   console.log(111)
    //   // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
    //   // 【按需求更改】这里是 code 为业务后端业务状态码，0表示成功
    //   // if (event instanceof HttpResponse && event.body.code !== 0) {
    //   //   // observer.error 会跳转至后面的 `catch`
    //   //   return Observable.create(observer => observer.error(event));
    //   // }
    //   // 若一切都正常，则后续操作
    //   return Observable.create(observer => observer.next(event));
    // })
    // .catch((res: HttpResponse<any>) => {
    //   console.log(222)
    //   // 一些通用操作
    //   // switch (res.status) {
    //   //   case 401: // 未登录状态码
    //   //     this.goLogin();
    //   //     break;
    //   //   case 200:
    //   //     // 业务层级错误处理
    //   //     console.log('业务错误');
    //   //     break;
    //   //   case 404:
    //   //     // 404
    //   //     break;
    //   // }
    //   // 以错误的形式结束本次请求
    //   return Observable.throw(res);
    // })
  }
}