import { Injectable } from "@angular/core";
import { AjaxService } from '../shared/services/ajax.service';
import { service, config } from './core.config';

@Injectable()
export class CoreService {
    constructor(private ajaxService: AjaxService) { }

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
    };
    
	
}