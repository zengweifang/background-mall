import { Pipe , PipeTransform } from '@angular/core';

@Pipe({
	name : 'genderPipe'
})

export class GenderPipe implements PipeTransform{
	transform(type : number):String{
		switch (type) {
            case 1:
                return "男"
            case 2:
                return "女";
            case 3:
                return "保密";
        }
	}
}