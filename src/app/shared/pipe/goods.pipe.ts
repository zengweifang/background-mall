import { Pipe , PipeTransform } from '@angular/core';

@Pipe({
	name : 'goodsTypeFilter'
})

export class GoodsTypePipe implements PipeTransform{
	transform(type : number):String{
		switch (type) {
            case  0:
                return "真实商品";
            case  1:
                return "虚拟商品";
        }
	}
}