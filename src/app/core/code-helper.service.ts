import { Injectable } from "@angular/core";

@Injectable()
export class CodeHelperService {
    isServerError(response:any) {
        if (!response || !response.code || !(response.code + '').length) {
            return true;
        }
        if (response.code === 200) {
            return false;
        }
        let codeStr = response.code + '';
        return codeStr.substr(codeStr.length - 3) !== '200';
    }
}