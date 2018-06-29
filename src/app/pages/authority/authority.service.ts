import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { service, config } from '../../core/core.config';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class AuthorityService {
	constructor(private ajaxService: AjaxService) { }

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	};



	//获取房源详情
	getUserList(data):Promise<any>{
		var u = service.commonService +'/background-manage/authority/user/list';
		return this.ajaxService.post(u,data);
	}	
	addUser(data):Promise<any>{
		var u = service.commonService +'/background-manage/authority/user/add';
		return this.ajaxService.post(u,{userName:data.userName,name:data.name,password:data.password});
	}	
	getRoleListWithUserId(id):Promise<any>{
		var u = service.commonService +'/background-manage/authority/user/role/list/'+id;
		return this.ajaxService.get(u);
	}
	saveUserRole(data):Promise<any>{
		var u = service.commonService +'/background-manage/authority/user/role/save';
		return this.ajaxService.post(u,data);
	}
	userUpdate(data):Promise<any>{
		var u = service.commonService +'/background-manage/authority/user/update';
		return this.ajaxService.post(u,{id:data.id,password:data.password,userName:data.userName});
	}	
	userDelete(id):Promise<any>{
		var u = service.commonService +'/background-manage/authority/user/delete/'+id;
		return this.ajaxService.post(u,id);
	}	
	getRoleList(data):Promise<any>{
		var u = service.commonService +'/background-manage/authority/role/list';
		return this.ajaxService.post(u,data);
	}
	getRoleAuthList(id):Promise<any>{
		var u =  service.commonService +'/background-manage/authority/'+id+"/auth/list/";
		return this.ajaxService.get(u);
	}
	addRole(data):Promise<any>{
		var u = service.commonService +'/background-manage/authority/role/add';
		return this.ajaxService.post(u,data);
	}	
	roleUpdate(data):Promise<any>{
		var u =  service.commonService +'/background-manage/authority/role/update';
		return this.ajaxService.post(u,data);
	}	
	roleDelete(id):Promise<any>{
		var u = service.commonService +'/background-manage/authority/role/delete/'+id;
		return this.ajaxService.post(u,id);
	}
	saveRoleAuth(data):Promise<any>{
		var u = service.commonService +'/background-manage/authority/role/auth/save';
		return this.ajaxService.post(u,data);
	}	
	getAuthGroupList():Promise<any>{
		var u = service.commonService +'/background-manage/authority/authgroup/list';
		return this.ajaxService.get(u);
	}	
	getAuthGroupAuthListByGroupId(id):Promise<any>{
		var u = service.commonService +'/background-manage/authority/authgroup/auth/list/'+id;
		return this.ajaxService.get(u);
	}
	addAuthGroup(data):Promise<any>{
		var u = service.commonService +'/background-manage/authority/authgroup/add';
		return this.ajaxService.post(u,data);
	}	
	authGroupUpdate(data):Promise<any>{
		var u = service.commonService +'/background-manage/authority/authgroup/update';
		return this.ajaxService.post(u,data);
	}
	authGroupDelete(id):Promise<any>{
		var u = service.commonService +'/background-manage/authority/authgroup/delete/'+id;
		return this.ajaxService.post(u,id);
	}
	addAuth(data):Promise<any>{
		var u = service.commonService +'/background-manage/authority/auth/add';
		return this.ajaxService.post(u,data);
	}	
	authUpdate(data):Promise<any>{
		var u = service.commonService +'/background-manage/authority/auth/update';
		return this.ajaxService.post(u,data);
	}
	authDelete(data):Promise<any>{
		var u = service.commonService +'/background-manage/authority/auth/delete';
		return this.ajaxService.post(u,data);
	}
	getMenuList(id):Promise<any>{
		var u = service.commonService +'/background-manage/menu/list/'+id;
		return this.ajaxService.get(u);
	}	
	saveMenu(data):Promise<any>{
		var u = service.commonService +'/background-manage/menu/role/add';
		return this.ajaxService.post(u,data);
	}
	getMenuWithRoleId(userId,roleId):Promise<any>{
		var u = service.commonService +'/background-manage/menu/list/'+userId+'/'+roleId;
		return this.ajaxService.post(u,{userId:userId,roleId:roleId});
	}

}