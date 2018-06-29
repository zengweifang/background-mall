import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import 'rxjs/add/operator/toPromise';

import { Menu } from './menu';
import { config,service } from '../../core/core.config';

@Injectable()
export class SiderService{
	private urlMenuList = service.commonService+'/background-manage/menu/list';

	constructor(private ajaxService : AjaxService){}

	getMenu(userId:String):Promise<Menu[]>{
		const menuUrl = `${this.urlMenuList}/${userId}`;
		return this.ajaxService.get(menuUrl);
	}

}