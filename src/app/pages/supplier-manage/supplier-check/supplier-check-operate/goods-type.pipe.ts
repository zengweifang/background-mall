import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'goodsTypePipe'
})

export class GoodsTypePipe implements PipeTransform {
  transform(data){
		return data.filter(item => item.thirdTypeName);
	}

}
