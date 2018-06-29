import { Pipe , PipeTransform } from '@angular/core';

@Pipe({
	name : 'imagePipe'
})

export class SiderPipe implements PipeTransform{
	transform(value : String ): String{
		return 'assets/bgr-imgs/默认状态/'+value;
	}
}

