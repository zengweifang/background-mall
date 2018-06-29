import { Pipe , PipeTransform } from '@angular/core';
import { service } from "../../core/core.config";

@Pipe({
	name : 'staticUrl'
})

export class StaticUrl implements PipeTransform{
	transform(url : String): String{
        return service.downUrl +"/"+ url;
	}
}