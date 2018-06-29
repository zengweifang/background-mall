import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import 'rxjs/add/operator/toPromise';
import { config,service } from '../../core/core.config';
import { utils } from '../../shared/utils/utils';

@Injectable()
export class StoreManagementService {
	

	private _storeServiceInventoryIsVirtual: boolean;

	get storeServiceInventoryIsVirtual(){
		return this._storeServiceInventoryIsVirtual ? this._storeServiceInventoryIsVirtual : utils.getSessionStorage('sm_storeServiceInventoryIsVirtual')
	}

	set storeServiceInventoryIsVirtual(value: boolean){
		this._storeServiceInventoryIsVirtual = value;
		utils.setSessionStorage('sm_storeServiceInventoryIsVirtual',value)
	}

	//

	private _showStoreServiceInventory: boolean;

	get showStoreServiceInventory(){
		return this._showStoreServiceInventory ? this._showStoreServiceInventory : utils.getSessionStorage('sm_showStoreServiceInventory')
	}

	set showStoreServiceInventory(value: boolean){
		this._showStoreServiceInventory = value;
		utils.setSessionStorage('sm_showStoreServiceInventory',value)
	}

	//

	private _storeServiceInventoryDisable: boolean;

	get storeServiceInventoryDisable(){
		return this._storeServiceInventoryDisable ? this._storeServiceInventoryDisable : utils.getSessionStorage('sm_storeServiceInventoryDisable')
	}

	set storeServiceInventoryDisable(value: boolean){
		this._storeServiceInventoryDisable = value;
		utils.setSessionStorage('sm_storeServiceInventoryDisable',value)
	}


	constructor(private ajaxService : AjaxService){}
	// 判断日期是否有交集
	isExistIntersectionForServiceTime(firstStartDate: Date,twoStartDate: Date,twoEndDate: Date,firstEndDate: Date){
		
		
		if(twoStartDate.getHours() <= firstStartDate.getHours() && firstStartDate.getHours() <= twoEndDate.getHours()){
			return true;
		}

		if(twoStartDate.getHours() <= firstEndDate.getHours() && firstEndDate.getHours() <= twoEndDate.getHours()){
			return true;
		}

		if(firstStartDate.getHours() <= twoStartDate.getHours() && twoStartDate.getHours() <= firstEndDate.getHours()){
			return true;
		}

		if(firstStartDate.getHours() <= twoEndDate.getHours() && twoEndDate.getHours() <= firstEndDate.getHours()){
			return true;
		}
		return false;
	
			
	}


	isExistIntersectionForMetaData(firstStartDate: Date,twoStartDate: Date,twoEndDate: Date,firstEndDate?: Date){
		
		if(firstEndDate){
			if(twoStartDate.getTime() < firstStartDate.getTime() && firstStartDate.getTime() < twoEndDate.getTime()){
				return true;
			}
	
			if(twoStartDate.getTime() < firstEndDate.getTime() && firstEndDate.getTime() < twoEndDate.getTime()){
				return true;
			}
	
			if(firstStartDate.getTime() < twoStartDate.getTime() && twoStartDate.getTime() < firstEndDate.getTime()){
				return true;
			}
	
			if(firstStartDate.getTime() < twoEndDate.getTime() && twoEndDate.getTime() < firstEndDate.getTime()){
				return true;
			}
			return false;
		}else{
			if(twoStartDate.getTime() < firstStartDate.getTime() && firstStartDate.getTime() < twoEndDate.getTime()){
				return true;
			}
			return false;
		}
			
	}

	

}