import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
import { OperationListService } from '../operation-list.service';
import { CodeHelperService } from "../../../../core/code-helper.service";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { error } from 'util';


@Component({
    selector: 'nz-demo-component',
    templateUrl: './operation-goods-import-modal.component.html',
    styleUrls: ['./operation-goods-import-modal.component.css']
})
export class OperationGoodsImportModalComponent implements OnInit {
    constructor(
        private subject: NzModalSubject,
        private fb: FormBuilder,
        private operationListService: OperationListService,
        private message: NzMessageService,
        private codeHelperService: CodeHelperService,
    ) { }

    _channelId: string;
    _channelName: string;

    allChannelList = [];
    selectedOption;

    isLoading = false;


    @Input()
    set channelId(value: string) {
        this._channelId = value;
    }
    @Input()
    set channelName(value: string) {
        this._channelName = value;
    }

    ngOnInit() {
        this.getAllChannelList();
    }

    getAllChannelList() {
        this.operationListService.getAllChannelList(null).then(resp => {
            if (!this.codeHelperService.isServerError(resp)) {
                this.allChannelList = resp.data;
            } else {
                this.message.create('error', resp.message ? resp.message : '加载失败');
            }
        }).catch(error => {
            this.message.create('error', '加载失败');
        })
    }

    submitForm = ($event, value) => {
        $event.preventDefault();
    };

    handleCancel(e) {
        this.subject.destroy('onCancel');
    }

    _submitForm() {
        let params = {
            "sourceChannel": this.selectedOption,
            "targetChannel": this._channelId,
        }
        this.isLoading = true;
        this.operationListService.copyChannel(params).then(resp => {
            this.isLoading = false;
            if (!this.codeHelperService.isServerError(resp)) {
                this.subject.destroy('onOk');
            } else {
                this.message.create('error', resp.message ? resp.message : '导入失败');
            }
        }).catch(error => {
            this.isLoading = false;
            this.message.create('error', '导入失败');
        })
    }
}