import { Pipe , PipeTransform } from '@angular/core';

@Pipe({
	name : 'urlPipe'
})

//该pipe暂时未用
export class UrlPipe implements PipeTransform{
	transform(value : String):String{
		var value1 =value.split('#')[1];
		var value2 = value1.split('?')[0];
		return value2;
	}
}