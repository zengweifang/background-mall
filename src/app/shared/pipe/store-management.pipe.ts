import { Pipe , PipeTransform } from '@angular/core';
import { service } from "../../core/core.config";
import { utils } from '../utils/utils';
@Pipe({
	name : 'storeStatus'
})

export class StoreStatus implements PipeTransform{
	transform(type : number): String{
        switch (type) {
            case 0:
                return "已关闭"
            case 1:
                return "营业中";
        }
	}
}

@Pipe({
    name : 'storeServiceTime',
    pure: false
})

export class StoreServiceTime implements PipeTransform{
	transform(arr){
        let newArr = [];
        if(arr.length > 0){
            newArr = arr.sort(utils.compare('timeStart'));
        }
        return newArr;
	}
}