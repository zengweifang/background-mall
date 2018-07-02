import { Component,Input,OnInit } from "@angular/core";
import { NzModalSubject } from "ng-zorro-antd";
import { FormBuilder,FormGroup,Validators,FormControl } from "@angular/forms";
import { BannerService } from "../banner.service";
import { ValidatorService } from "../../../core/validator.service";
import { Router } from '@angular/router';

@Component({
    selector:'edit-banner-component',
    templateUrl:'./edit.component.html',
    styleUrls:['../../../app.component.scss']
})

export class EditBannerComponent implements OnInit{
    validateForm: FormGroup;
    _id:string;
    isConfirmLoading = false;
    editParams = {};
    
    @Input()
    set id(value:string){
        this._id = value;
    }
    emitDataOutside(){
        // this.isConfirmLoading = true;
        // this.bannerService.saveApartmentDetail(this.apartmentInfo).then(res => {
        //     res["status"] = true;
        //     setTimeout(() => {
        //         this.isConfirmLoading = false;
        //         this.subject.destroy('onCancel');
        //         this.subject.next(res);
        //     }, 500);
            
        // })

        // this.bannerService.update(this.editParams).then(res=>{
        //     console.log(res)
        // })
        this.router.navigate(['/list/list'])//test
    }

    handleCancel(e){
        // this.subject.destroy('onCancel');
        history.back()
    }

    constructor(private subject:NzModalSubject,
        private fb:FormBuilder,
        private bannerService:BannerService,
        private validatorService:ValidatorService,
        private router:Router){
        this.subject.on('onDestrory',()=>{
            console.log('destroy');
        })

        var id = 1;
        // this.getBannerInfo(id)
        this.editParams = {
            "id": "3091804932271473664",
            "name": "banner图1",
            "imageUrl": "http://bpic.588ku.com/back_pic/03/70/72/5257b6c12d89875.jpg!r850/fw/800",
            "url": "/index",
            "sort": 0,
            "description": "banner图测试"
          }
    }

    getBannerInfo(id){
        this.bannerService.getBannerInfo(id).then(res=>{
            console.log(res)
        })
    }

    ngOnInit(){
        this.validateForm = this.fb.group({
            name:["",[this.validatorService.nameValidator]],
            imageUrl:["",[this.validatorService.nameValidator]],
            url:["",[this.validatorService.nameValidator]],
            sort:["",[this.validatorService.nameValidator]],
            description:["",[this.validatorService.nameValidator]]
        })
        // this.apartmentService.getApartmentDetail(this._id).then(res => this.apartmentInfo = res.data)
    }

    getFormControl(name){
        return this.validateForm.controls[name];
    }
}