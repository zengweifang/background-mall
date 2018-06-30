import { Component,Input,OnInit } from "@angular/core";
import { NzModalSubject } from "ng-zorro-antd";
import { FormBuilder,FormGroup,Validators,FormControl } from "@angular/forms";
import { ClubsService } from "../clubs.service";
import { ValidatorService } from "../../../core/validator.service";
import { Router } from '@angular/router';

@Component({
    selector:'edit-clubs-component',
    templateUrl:'./edit.component.html',
    styleUrls:['../../../app.component.scss']
})

export class EditClubsComponent implements OnInit{
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
        // this.clubsService.saveApartmentDetail(this.apartmentInfo).then(res => {
        //     res["status"] = true;
        //     setTimeout(() => {
        //         this.isConfirmLoading = false;
        //         this.subject.destroy('onCancel');
        //         this.subject.next(res);
        //     }, 500);
            
        // })

        // this.clubsService.update(this.editParams).then(res=>{
        //     console.log(res)
        // })
        this.router.navigate(['/clubs/list/list'])//test
    }

    handleCancel(e){
        // this.subject.destroy('onCancel');
        history.back()
    }

    constructor(private subject:NzModalSubject,
        private fb:FormBuilder,
        private clubsService:ClubsService,
        private validatorService:ValidatorService,
        private router:Router){
        this.subject.on('onDestrory',()=>{
            console.log('destroy');
        })

        var id = 1;
        // this.getClubsInfo(id)
        this.editParams =  {
            "id": "3091804935614645248",
            "num": 1,
            "imageUrl": "https://img11.360buyimg.com/n7/jfs/t14947/152/2547272843/249018/b643c07c/5aa8c8a8N7cc84d18.jpg",
            "url": "/index"
          }
    }

    getClubsInfo(id){
        this.clubsService.getClubsInfo(id).then(res=>{
            console.log(res)
        })
    }

    ngOnInit(){
        this.validateForm = this.fb.group({
            num:["",[this.validatorService.nameValidator]],
            imageUrl:["",[this.validatorService.nameValidator]],
            url:["",[this.validatorService.nameValidator]]
        })
        // this.clubsService.getApartmentDetail(this._id).then(res => this.apartmentInfo = res.data)
    }

    getFormControl(name){
        return this.validateForm.controls[name];
    }
}