import { Injectable } from '@angular/core';
import { HttpClient,HttpRequest } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AjaxService {

  constructor(private http: HttpClient) { }
  _options(options = {}){
    return options
  }
  
  get(url,options?):Promise<any>{
    let optionsFliter = this._options(options)
    return this.http.get(url,optionsFliter).toPromise()
  }

  post(url,body?,options?):Promise<any>{
    let optionsFliter = this._options(options)
    return this.http.post(url,body,optionsFliter).toPromise()
  }

  getCityJson(){
    return this.http.get("assets/json/city.json");
  }
}
