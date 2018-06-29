import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";

@Injectable()
export class ValidatorService {
    nameValidator = (control: FormControl): { [s: string]: boolean } => {
        const NAME_REGEXP = /^[\u4e00-\u9fa5a-zA-Z0-9_]{1,56}$/;
        if (!control.value) {
            return { required: true }
        } else if (!NAME_REGEXP.test(control.value)) {
            return { error: true, name: true };
        }
    };

    contactValidator = (control: FormControl): { [s: string]: boolean } => {
        const CONTACT_REGEXP = /^[\u4e00-\u9fa5a-zA-Z]{1,32}$/;
        if (!control.value) {
            return { required: true }
        } else if (!CONTACT_REGEXP.test(control.value)) {
            return { error: true, contact: true };
        }
    };

    phoneValidator = (control: FormControl): { [s: string]: boolean } => {
        const PHONE_REGEXP = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (!control.value) {
            return { required: true }
        } else if (!PHONE_REGEXP.test(control.value)) {
            return { error: true, phone: true };
        }
    };

    accountValidator = (control: FormControl): { [s: string]: boolean } => {
        const ACCOUNT_REGEXP = /^[a-zA-Z0-9_]{6,56}$/;
        if (!control.value) {
            return { required: true }
        } else if (!ACCOUNT_REGEXP.test(control.value)) {
            return { error: true, account: true };
        }
    };

    addressValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true }
        } else if (control.value.length>128) {
            return { error: true, address: true };
        }
    };

    floorAreaValidator = (control: FormControl): { [s: string]: boolean } => {
        const FLOORAREA_REGEXP =/^\d+(\.\d+)?$/;
        if (!FLOORAREA_REGEXP.test(control.value)) {
            return { error: true, floorArea: true };
        }
    };

    remarkValidator = (control: FormControl): { [s: string]: boolean } => {
        const REMARK_REGEXP = /^[\s\S]{0,128}$/;
        if (!REMARK_REGEXP.test(control.value)) {
            return { error: true, remark: true };
        }
    };

    serviceNameValidator = (control: FormControl): { [s: string]: boolean } => {
        const SERVICENAME_REGEXP = /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,64}$/;
        if (!control.value) {
            return { required: true }
        } else if (!SERVICENAME_REGEXP.test(control.value)) {
            return { error: true, serviceName: true };
        }
    };

    // 固定电话
    telValidator = (control: FormControl): { [s: string]: boolean } => {
        const TEL_REGEXP = /^[0-9]{8,13}$/;
        if(!control.value){
            // return { required: false }
        }else if (!TEL_REGEXP.test(control.value)) {
            return { error: true, tel: true };
        }
        
    };

    // 身份证
    idCardValidator = (control: FormControl): { [s: string]: boolean } => {
        const IDCARD_REGEXP = /^(^\d{18}$|^\d{17}(\d|X|x))$/;
        if (!control.value) {
            return { required: true }
        } else if (!IDCARD_REGEXP.test(control.value)) {
            return { error: true, idCard: true };
        }
    };

    // QQ号码
    qqValidator = (control: FormControl): { [s: string]: boolean } => {
        const QQ_REGEXP = /^[1-9][0-9]{4,14}$/;
        if(!control.value){
            // return { required: false }
        }else if (!QQ_REGEXP.test(control.value)) {
            return { error: true, qq: true };
        }
        
    };

    // 邮箱
    emailValidator = (control: FormControl): { [s: string]: boolean } => {
        const EMAIL_REGEXP = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!control.value) {
            return { required: true }
        } else if (!EMAIL_REGEXP.test(control.value)) {
            return { error: true, email: true };
        }
    };

    // 邮政编码
    postalCodeValidator = (control: FormControl): { [s: string]: boolean } => {
        const POSTALCODE_REGEXP = /^[0-9]{6}$/;
        if(!control.value){
            // return { required: false }
        }else if (!POSTALCODE_REGEXP.test(control.value)) {
            return { error: true, postalCode: true };
        }
        
    };

    // 自定义数量
    customCountValidator = (control: FormControl): { [s: string]: boolean } => {
        const CUSTOMCOUNT_REGEXP = /^[0-9]+([.]\d{1,2})?$/;
        if (!control.value) {
            return { required: true }
        } else if (!CUSTOMCOUNT_REGEXP.test(control.value)) {
            return { error: true, customCount: true };
        }
    };

    resonValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true }
        } else if (control.value.length>140) {
            return { error: true, reson: true };
        }
    };

    //密码校验
    passwordValidator = (control: FormControl): { [s: string]: boolean } => {
        const CUSTOMCOUNT_REGEXP = /^[a-zA-Z0-9]{6,10}$/;
        if (!control.value) {
            return { required: true }
        } else if (!CUSTOMCOUNT_REGEXP.test(control.value)) {
            return { error: true, password: true };
        }
    };   
}