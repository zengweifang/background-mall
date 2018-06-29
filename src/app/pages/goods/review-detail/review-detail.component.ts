import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CodeHelperService } from "../../../core/code-helper.service";

import { GoodsReviewService } from "../goods.service";
import { CommonService } from "../../../shared/services/common.service";

import { DisReviewModalComponent } from "../review-modal/dis-review-modal.component";

@Component({
    selector: 'goods-review-detail',
    templateUrl: './review-detail.component.html',
    styleUrls: ['./review-detail.component.scss']
})
export class GoodsReviewDetailComponent implements OnInit {
    userId = sessionStorage.getItem('userId');
    goodsInfo = {
        goodsDTO: {
            goodsImageDTOList: [],
        },
        attributeGroupVO: {
            userAttributeDefineVOList: []
        }
    };

    _loading = false;
    goodsId: string;
    isEdit: string;
    imgList = [];
    logsList = {
        logs: [],
        page: {
            totalCount: 0
        }
    };

    getLogsParams = {};
    doreviewParams = {};


    constructor(private fb: FormBuilder,
        private message: NzMessageService,
        private goodsReviewService: GoodsReviewService,
        private codeHelperService: CodeHelperService,
        private commonService: CommonService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private modalService:NzModalService) {

        this.activatedRoute.paramMap
            .switchMap((params: ParamMap) => this.goodsId = params.get('goodsId'))
            .subscribe()
        this.activatedRoute.paramMap
            .switchMap((params: ParamMap) => this.isEdit = params.get('isEdit'))
            .subscribe()
    }

    setImgList(data) {
        data.forEach((i, index) => {
            this.imgList[index].url = i.url;
        });
    }
    disReview(){
        const disReviewModal = this.modalService.open({
			title:'审核不通过',
            content:DisReviewModalComponent,
            componentParams:{
                goodsId: this.goodsId
            },
			onOk(){
				console.log('click ok')
			},
			onCancel(){
				console.log('click cancel');
			},
			footer:false
		});
		disReviewModal.subscribe(result => {
			if(result.status){
				if(!this.codeHelperService.isServerError(result)){
                    this.message.create('success', result.message);
                    this.router.navigate(['custom/auditing/11']);
				}else{
					this.message.create('error', result.message);
				}
			}
		})
    }

    //通过审核
    doreview() {
        this.goodsReviewService.doreview(this.doreviewParams).then(res => {
            if (!this.codeHelperService.isServerError(res)) {
                this.router.navigate(['custom/auditing/11']);
                this.message.create('success', res.message);
            } else {
                this.message.create('error', res.message);
            }
        })
    }

    //获取审核记录
    reviewLogs(data) {
        this._loading = true;
        this.goodsReviewService.reviewLogs(data).then(res => {
            this._loading = false;
            this.logsList = res.data;
        })
    }

    //获取详情
    preVerifyView(goodsId) {
        this.goodsReviewService.preVerifyView(goodsId).then(res => {
            this.goodsInfo = res.data;
            this.setImgList(res.data.goodsDTO.goodsImageDTOList);
        })
    }

    getCommodityInfo(goodId) {
        this.goodsReviewService.getCommodityInfo(goodId).then(res => {
            if (!this.codeHelperService.isServerError(res)) {
                this.goodsInfo = res.data;
                this.setImgList(res.data.goodsDTO.goodsImageDTOList);
            } else {
                this.message.create('error', res.message || '加载商品信息失败');
            }
        }).catch(err => {
            this.message.create('error', '加载商品信息失败');
        })
    }

    ngOnInit() {
        if (this.isEdit === '1') {
            this.getCommodityInfo(this.goodsId);
        } else {
            this.preVerifyView(this.goodsId);
        }

        this.getLogsParams = {
            page: { currentPage: 1, pageSize: 10 },
            goodId: this.goodsId
        }
        this.doreviewParams = { goodId: this.goodsId, reviewerId: this.userId }

        this.reviewLogs(this.getLogsParams);

        for (let index = 0; index < 8; index++) {
            this.imgList.push({
                id: index,
                url: ""
            })
        }
    }
}
