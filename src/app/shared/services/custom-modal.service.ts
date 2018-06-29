import { Injectable, ModuleWithComponentFactories, TemplateRef, Type } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
interface CustomModalConfigInterface {
    type?: string;
    title?: string;
    content?: string | Type<any>;
    width?: string | number;
    zIndex?: number;
    iconType?: string;
    okText?: string;
    nzClass?: string;
    cancelText?: string;
    style?: object;
    class?: string;
    closable?: boolean;
    maskClosable?: boolean;
    wrapClassName?: string;
    footer?: TemplateRef<void> | boolean;
    showConfirmLoading?: boolean;
    onOk?: () => void;
    onCancel?: () => void;
    componentParams?: object;
    moduleWithComponentFactories?: ModuleWithComponentFactories<void>;
}

interface HeaderStyleConfigInterface {
    color?: string;
    backgroundColor?: string;
}
@Injectable()
export class CustomModalService extends NzModalService {
    _confirm(config: CustomModalConfigInterface = {}){
        let initOptionsOfModal = {
            title: '提示',
            content: '确定执行该操作？',
            width: 240,
            closable: false,
            maskClosable: false,
            wrapClassName: 'custom-confirm-modal'
        }
        let extendOptionsOfModal = $.extend(initOptionsOfModal,config);
        let modal = this.open(extendOptionsOfModal);
        return modal;
    }
    _content(config: CustomModalConfigInterface = {},headerStyle: HeaderStyleConfigInterface = {}){
        let initOptionsOfModal = {
            title: '***',
            content: '********',
            width: 720,
            footer: false,
            maskClosable: false,
            wrapClassName: 'custom-content-modal'
        }
        let initOptionsOfHeader = {
            color: '#fff',
            backgroundColor: '#3c90ea'
        }
        let extendOptionsOfModal = $.extend(initOptionsOfModal,config);
        let extendOptionsOfHeader = $.extend(initOptionsOfHeader,headerStyle);
        let modal = this.open(extendOptionsOfModal);
        setTimeout(() => {
            $('.ant-modal-content .ant-modal-header').css({
                'background-color': extendOptionsOfHeader.backgroundColor
            });
            $('.ant-modal-content .ant-modal-header .ant-modal-title').css({
                'color': extendOptionsOfHeader.color
            });
        },0)

        return modal;
    }
}
