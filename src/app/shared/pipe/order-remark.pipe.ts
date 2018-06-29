import { Pipe , PipeTransform } from '@angular/core';

@Pipe({
	name : 'remarkFilter'
})

export class remarkFilter implements PipeTransform{
	transform(type : number):String{
		switch (type) {
            case 0:
                return "green"
            case 1:
                return "red";
            case 2:
                return "orange";
        }
	}
}