import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject, NzMessageService,NzModalService } from "ng-zorro-antd";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ApartmentService } from "../../../apartment.service";
import { CodeHelperService } from "../../../../../core/code-helper.service";
import { RejectWoComponent } from "../modal/reject-wo/reject-wo.component";
import { UnsatistyWoComponent } from "../modal/unsatisty-wo/unsatisty-wo.component";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ApartmentWoDetailComponent implements OnInit {
  _id: string;
  current = 0;
  isConfirmLoading = false;
  _loading = false;
  workOrderDetailInfo = {'number':''};
  reasons = [{ value: '1', label: '没人服务' }, { value: '2', label: '其他原因' }]
  rejectParams = {};

  handleCancel(e) {
    this.subject.destroy('onCancel');
  }

  getCurrentStatus(orderStatus) {
    switch (orderStatus) {
      case 0:
      case 23:
      case null:
        this.current = 0;
        break;
      case 31:
        this.current = 1;
        break;
      case 425:
        this.current = 2;
        break;
      case 51:
        this.current = 3;
        break;
    }
  }

  getWorkOrderDetail(id) {
    this.apartmentService.getWorkOrderDetail(id).then(res => {
      console.log(res)
      this.workOrderDetailInfo = res.data;
      this.getCurrentStatus(res.data.orderStatus);
    })
  }

  //取消周期预约
  cancelPeriod(data) {
    this.modalService.confirm({
      title: '确定取消周期预约，取消后将不再根据周期进行自动下单',
      onOk() {
        this.cancelPeriodApi(data);
      },
      onCancel() {
      }
    });
  }
  cancelPeriodApi(data) {
    this._loading = true;
    this.apartmentService.cancelServicePeriod(data.id).then(res => {
      if (!this.codeHelperService.isServerError(res)) {
        this.message.create("success",res.message);
        this.getWorkOrderDetail(this._id);
      }
      this._loading = false;
    })
  }

  //撤销工单
  rejectWorkOrder() {
    const subAddModal = this.modalService.open({
			title:'撤销工单',
      content:RejectWoComponent,
			onOk(){
				console.log('click ok')
			},
			onCancel(){
				console.log('click cancel');
			},
			footer:false
		});
		subAddModal.subscribe(result => {
      if(result.rejectType){
        result.id = this._id;
        this.apartmentService.rejectWorkOrder(result).then(res=>{
          if(!this.codeHelperService.isServerError(res)){
            this.message.create("success",res.message);
            this.getWorkOrderDetail(this._id);
          }else{
            this.message.create("error",res.message);
          }
        })
      }
		})
  }

  //满意
  toSatisty(item){
    var data={
      comments:'',
		  id:item.id,
      workOrderNumber:this.workOrderDetailInfo.number,
		  status:1
    }
    this.apartmentService.commont(data).then(res=>{
      console.log(res)
      if(!this.codeHelperService.isServerError(res)){
        this.message.create("success",res.message);
        this.getWorkOrderDetail(this._id);
      }else{
        this.message.create("error",res.message);
      }
    })
  }

  //不满意
  unsatisty(item){
    const subAddModal = this.modalService.open({
			title:'不满意原因',
      content:UnsatistyWoComponent,
			onOk(){
				console.log('click ok')
			},
			onCancel(){
				console.log('click cancel');
			},
			footer:false
		});
		subAddModal.subscribe(result => {
      if(result.unsatistyCommont){
        var data={
          comments:result.unsatistyCommont,
          id:item.id,
          workOrderNumber:this.workOrderDetailInfo.number,
          status:2
        }
        this.apartmentService.commont(data).then(res=>{
          if(!this.codeHelperService.isServerError(res)){
            this.message.create("success",res.message);
            this.getWorkOrderDetail(this._id);
          }else{
            this.message.create("error",res.message);
          }
        })
      }
		})
  }

  constructor(private subject: NzModalSubject, 
              private fb: FormBuilder, 
              private apartmentService: ApartmentService, 
              private activatedRoute: ActivatedRoute, 
              private codeHelperService: CodeHelperService, 
              private message: NzMessageService,
              private modalService:NzModalService) {
  }
  ngOnInit() {
    this._id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getWorkOrderDetail(this._id);
  }

}
