import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'woStatusPipe'
})

export class WoStatusPipe implements PipeTransform {
    transform(type: number): String {
        switch (type) {
            case 1:
                return "待处理";
            case 2:
                return "已处理";
            case 3:
                return "服务完成";
            case 4:
                return "已撤回";
        }
    }
}

@Pipe({
    name: 'commenPipe'
})

export class CommenPipe implements PipeTransform {
    transform(type: number): String {
        switch (type) {
            case 0:
                return "未验收";
            case 1:
                return "满意";
            case 2:
                return '不满意';
        }
    }
}

@Pipe({
    name: 'servicePeriodPipe'
})

export class ServicePeriodPipe implements PipeTransform {
    transform(type: number): String {
        switch (type) {
            case 0:
                return "无";
            case 1:
                return "一周";
            case 2:
                return '两周';
            case 3:
                return '三周';
            case 4:
                return '四周';
            case 5:
                return '五周';
        }
    }
}


