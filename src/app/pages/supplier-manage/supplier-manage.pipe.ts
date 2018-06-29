import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'providerStatusPipe'
})
export class ProviderStatusPipe implements PipeTransform {
  transform(type : number):String{
		switch(type) {
      case 0:
          return "封停";
      case 1:
          return "正常";
    }
	}

}
