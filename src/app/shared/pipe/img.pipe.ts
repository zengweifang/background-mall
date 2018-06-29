import { Pipe , PipeTransform } from '@angular/core';
import { service } from "../../core/core.config";

@Pipe({
	name : 'imgPipe'
})

export class ImgPipe implements PipeTransform{
	transform(url : String, temp: String):String{
		if (url === undefined || url ==null)
            return "images/common_default_icon.png";
        return service.uploadReturnUrl + temp +"/"+ url;
	}
}