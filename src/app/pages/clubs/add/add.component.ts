import { Component,Input,OnInit } from "@angular/core";
import { NzModalSubject } from "ng-zorro-antd";
import { FormBuilder,FormGroup,Validators,FormControl } from "@angular/forms";
import { ClubsService } from "../clubs.service";
import { ValidatorService } from "../../../core/validator.service";
import { Router } from '@angular/router';

@Component({
    selector:'add-clubs-component',
    templateUrl:'./add.component.html',
    styleUrls:['../../../app.component.scss']
})

export class AddClubsComponent implements OnInit{
    validateForm: FormGroup;
    _id:string;
    isConfirmLoading = false;
    addParams = {};
    
    @Input()
    set id(value:string){
        this._id = value;
    }
    emitDataOutside(){
        // this.isConfirmLoading = true;
        // this.clubsService.addApartment(this.apartmentInfo).then(res => {
        //     res["status"] = true;
        //     setTimeout(() => {
        //         this.isConfirmLoading = false;
        //         this.subject.destroy('onCancel');
        //         this.subject.next(res);
        //     }, 500);
            
        // })

        // this.clubsService.add(this.addParams).then(res=>{
        //     console.log(res)
        //     this.router.navigate(['/list/list'])
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
    }
    
    ngOnInit(){
        this.validateForm = this.fb.group({
            num:["",[this.validatorService.nameValidator]],
            imageUrl:["",[this.validatorService.nameValidator]],
            url:["",[this.validatorService.nameValidator]]
        })
    }

    getFormControl(name){
        return this.validateForm.controls[name];
    }
}