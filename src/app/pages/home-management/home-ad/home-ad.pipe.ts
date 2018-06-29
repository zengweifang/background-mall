import { Pipe , PipeTransform } from '@angular/core';

@Pipe({
	name : 'adStatusPipe'
})

export class adStatusPipe implements PipeTransform{
	transform(status):String{
		switch(status) {
            case 0:
                return "草稿";
            case 1:
                return "已发布";
            case 2:
                return "进行中";
            case 3:
                return "已失效";
            default:
                return '';
        }
	}
}