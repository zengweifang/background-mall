import { Pipe , PipeTransform } from '@angular/core';

@Pipe({
	name : 'gisStatus'
})

export class GisStatusPipe implements PipeTransform{
	transform(type : number):String{
		switch (type) {
            case 1:
                return "新增";
            case 2:
                return "删除";
            case 3:
                return "修改";
        }
	}
}