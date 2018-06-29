import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService, UploadFile } from 'ng-zorro-antd';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CodeHelperService } from "../../../core/code-helper.service";
import { config, service } from '../../../core/core.config';

import { CommodityManagementService } from "../commodity-management.service";
import { CommonService } from "../../../shared/services/common.service";
import { CustomModalService } from '../../../shared/services/custom-modal.service';

@Component({
    selector: 'app-good-edit',
    templateUrl: './good-edit.component.html',
    styleUrls: ['./good-edit.component.scss']
})
export class GoodEditComponent implements OnInit {
    validateForm: FormGroup;
    constructor(private fb: FormBuilder,
        private message: NzMessageService,
        private codeHelperService: CodeHelperService,
        private commodityManagementService: CommodityManagementService,
        private commonService: CommonService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NzModalService,
        private customModalService: CustomModalService,
    ) {
    }

    isAddNew: boolean = false;

    ngOnInit() {
        this.validateForm = this.fb.group({
            name: ['', [Validators.required]],
            goodsTypeFullName: ['', [Validators.required]],
            virtual: [0, [Validators.required]],
            price: [0, [Validators.required]],
            originalPrice: [0, [Validators.required]],
            costPrice: [0, [Validators.required]],
            weight: [0, [Validators.required]],
            code: ['', [Validators.required]],
            barcode: ['', [Validators.required]],
            hasDeposit: ['', [Validators.required]],
            duration: ['', [Validators.required]],
            maxOrders: ['', [Validators.required]],
            minOrders: ['', [Validators.required]],
        });
        this.commitData.goodsDTO.id = this.route.snapshot.paramMap.get('goodsId');
        if (!this.goodsId) {
            this.isAddNew = true;
            this.getGoodsAttributes('');
        } else {
            this.isAddNew = false;
            this.getGoodInfo();
        }
    }

    userId = sessionStorage.getItem('userId');

    goodsId: string;

    commitData = {
        "goodsDTO": {
            "id": "",
            "name": "",
            "code": "",
            "barcode": null,
            "costPrice": null,
            "price": 0,
            "originalPrice": 0,
            "hasDeposit": false,
            "verifyStatus": 13,
            "goodCategoryId": "",
            "goodsCategoryName": null,
            "goodsTypeId": "",
            "goodsTypeName": "",
            "goodsTypeFullName": "",
            "supplierId": "",
            "supplierName": null,
            "supplierType": null,
            "summary": "",
            "descriptions": "",
            "goodsImageDTOList": [],
            "goodsAttributeDTO": null,
            "goodsPayflowConfigDTOList": null,
            "weight": 0,
            "virtual": 0,
            "duration": null,
            "minOrders": null,
            "maxOrders": null,
            "maxBookDays": null,
            "subscriptionType": null,
            "subscriptionId": null,
            "subscriptionServiceDtoList": null
        },
        "attributeGroupVO": null,
        "verifyFailReason": null
    };

    hasServiceInventory: boolean = false;
    verifyFailReason: string = '';
    showAttribute: boolean = false;

    getGoodInfo() {
        if (!this.goodsId) {
            this.message.create('error', '商品ID不能为空');
            return;
        }
        this.commodityManagementService.getEditGoodInfo(this.goodsId).then(resp => {
            if (!this.codeHelperService.isServerError(resp)) {
                // 获取可选的属性小组列表
                this.getGoodsAttributes('');
                this.commitData = resp.data;
                // 是否服务库存
                this.hasServiceInventory = resp.data.goodsDTO.duration != null;
                this.commitData.goodsDTO.duration = this.hasServiceInventory ? 1 : null;
                // 错误原因
                this.verifyFailReason = this.commitData.verifyFailReason;
                // 是否显示属性小组
                if (this.commitData.goodsDTO.goodsAttributeDTO && this.commitData.attributeGroupVO && this.commitData.attributeGroupVO.id === this.commitData.goodsDTO.goodsAttributeDTO.attributeGroupId) {
                    this.goodsAttributeDetail = this.commitData.attributeGroupVO
                    let detailAttrObj = (this.goodsAttributeDetail.supplierAttributeDefineVOList.length) ? 
                                            this.goodsAttributeDetail.supplierAttributeDefineVOList[0] : null;
                    let currentAttrObj = this.commitData.goodsDTO.goodsAttributeDTO.goodAttributeDefineDTOList.length ? this.commitData.goodsDTO.goodsAttributeDTO.goodAttributeDefineDTOList[0] : null;

                    if (detailAttrObj && currentAttrObj) {
                        Object.assign(detailAttrObj, currentAttrObj);
                    }
                }

                // 初始化图片列表
                this.goodsDetailFileList = [];
                this.commitData.goodsDTO.goodsImageDTOList.forEach((item, index) => {
                    this.goodsDetailFileList.push({
                        uid: index,
                        name: item.id,
                        status: 'done',
                        url: service.uploadReturnUrl + item.url,
                        originaUrl: item.url,
                    });
                })

            } else {
                this.message.create('error', resp.message || '获取商品信息失败');
            }
        }).catch(error => {
            this.message.create('error', '获取商品信息失败');
        })
    }

    goodsAttributes = [];

    getGoodsAttributes(keyword: string): void {
        this.commodityManagementService.getGoodsAttributes(keyword).then(resp => {
            if (!this.codeHelperService.isServerError(resp)) {
                this.goodsAttributes = resp.data;
                if (this.goodsAttributeDetail) {
                    this.goodsAttributes.forEach(item => {
                        if (this.goodsAttributeDetail.id === item.id) {
                            this.selectedGoodsAttribute = item;
                        }
                    })
                }
            } else {
                this.message.create('error', resp.message || '加载属性小组失败');
            }
        }).catch(error => {
            this.message.create('error', '加载属性小组失败');
        })
    }

    goodsAttributeDetail;

    goodsAttributeChange(item: any): void {
        this.goodsAttributeDetail = null;
        this.commitData.goodsDTO.goodsAttributeDTO = {};
        if (!item) {
            return;
        }
        this.commodityManagementService.getGoodsAttributeDetail(item.id).then(resp => {
            if (!this.codeHelperService.isServerError(resp)) {
                this.goodsAttributeDetail = resp.data
                this.commitData.goodsDTO.goodsAttributeDTO = {
                    attributeGroupId: item.id,
                    goodAttributeDefineDTOList: []
                }
            } else {
                this.message.create('error', resp.message || '加载属性小组详情失败');
            }
        }).catch(error => {
            this.message.create('error', '加载属性小组详情失败');
        });
    }

    editorConfig = {
        height: '600px',
		extraPlugins: 'print,format,font,colorbutton,justify,image2,uploadimage',
		// filebrowserImageBrowseUrl: service.uploadUrl,
		// filebrowserImageBrowseUrl: '/ckfinder/ckfinder.html?type=Images',
		// filebrowserUploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
		filebrowserImageUploadUrl: service.uploadUrl,
		// filebrowserImageUploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images',
		// uploadUrl: service.uploadUrl,
		// uploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
    }
    
    onFileUploadRequest($event) {
		var fileLoader = $event.data.fileLoader,
			formData = new FormData(),
			xhr = fileLoader.xhr;

		xhr.open('POST', fileLoader.uploadUrl, true);
		formData.append('file', fileLoader.file, fileLoader.fileName);
		fileLoader.xhr.send(formData);
		$event.stop();
	}

    goodsDetailFileList = [];
    uploadUrl = service.uploadUrl;
    previewImage = '';
    previewVisible = false;
    handlePreview = (file: UploadFile) => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    goodsDetailImageUpdateStateChange($event) {
        if ($event.file.status === 'removed') {
            if ($event.fileList.length === 0) {
                this.commitData.goodsDTO.goodsImageDTOList = [];
            } else {
                let imgs = [];
                $event.fileList.forEach((element, index) => {
                    imgs.push({
                        url: element.originaUrl ? element.originaUrl : element.response.name,
                        status: index === 0,
                        primary: index === 0
                    });
                });
                this.commitData.goodsDTO.goodsImageDTOList = imgs;
            }
        } else if ($event.file.status === 'done' && $event.fileList.length > 0) {
            let imgs = [];
            $event.fileList.forEach((element, index) => {
                imgs.push({
                    url: element.originaUrl ? element.originaUrl : element.response.name,
                    status: index === 0,
                    primary: index === 0
                });
            });
            this.commitData.goodsDTO.goodsImageDTOList = imgs;
        }
    }

    options = [];
    selectedGoodsAttribute;


    currentModal;
    showImage(content) {
        this.currentModal = this.customModalService.open({
            title: '示例',
            content: content,
            maskClosable: false,
            width: '800px',
            onOk() {
                console.log('Click ok');
            }
        });
    }

    disableSubmitButton(): boolean {
        let canSubmit: boolean = true;
        canSubmit = this.commitData.goodsDTO.name 
            && this.commitData.goodsDTO.originalPrice >= 0 
            && this.commitData.goodsDTO.price >= 0
            && this.commitData.goodsDTO.weight >= 0
            && this.commitData.goodsDTO.descriptions.length > 0;
        if (this.hasServiceInventory) {
            canSubmit = canSubmit && this.commitData.goodsDTO.minOrders >= 0
                && this.commitData.goodsDTO.maxOrders >= 0;
        }
        return !canSubmit;
    }

    /**
     * 属性小组是否完整（应该是客户端验证吧）
     * 
     * @returns {boolean} true/false
     * @memberof GoodEditComponent
     */
    isGoodsAttributeValid(): boolean {
        // if (!this.selectedGoodsAttribute) {
        //     return true;
        // } else {
        //     this.goodsAttributeDetail.
        // }
        return false;
    }

    updateGood(): void {
        if (this.goodsAttributeDetail) {
            var attrTempList = [];
            this.goodsAttributeDetail.supplierAttributeDefineVOList.forEach(item => {
                if(item.attrType==1 && item.attributeValueId==null){
                    return;
                }
                if(item.attrType!=1 && item.attributeValue==null){
                    return;
                }
                var attrTempObj={
                    attributeDefineId:item.id,
                    attributeDefineName:item.title,
                    attributeValue:item.attributeValue,
                    attributeValueId:item.attributeValueId
                };
                if(item.attrType == 1){
                    item.attributeValueVOList.forEach((j) => {
                        if(j.id == item.attributeValueId){
                            attrTempObj.attributeValue=j.content;
                        };
                    })
                }
                attrTempList.push(attrTempObj);
            });
            this.commitData.goodsDTO.goodsAttributeDTO.goodAttributeDefineDTOList=attrTempList;
        }

        // console.log(this.commitData);
        // console.log(this.goodsAttributeDetail);
        // console.log(this.goodsDetailFileList);
        this.commodityManagementService.updateGood(this.commitData.goodsDTO).then(resp => {
            if (!this.codeHelperService.isServerError(resp)) {
                console.log('跳转商品列表？');
            } else {
                this.message.create('error', resp.message || '更新商品信息失败');
            }
        }).catch(error => {
            this.message.create('error', '更新商品信息失败');
        })
    }
}
