import { Component,Input,OnInit } from "@angular/core";
import { NzModalSubject } from "ng-zorro-antd";
import { FormBuilder,FormGroup,Validators,FormControl } from "@angular/forms";
import { ApartmentService } from "../apartment.service";
import { ValidatorService } from "../../../core/validator.service";
import { Router } from '@angular/router';

@Component({
    selector:'addApartment-modal-component',
    templateUrl:'./addModal.component.html',
    styleUrls:['../../../app.component.scss']
})

export class AddApartmentModalComponent implements OnInit{
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
        // this.apartmentService.addApartment(this.apartmentInfo).then(res => {
        //     res["status"] = true;
        //     setTimeout(() => {
        //         this.isConfirmLoading = false;
        //         this.subject.destroy('onCancel');
        //         this.subject.next(res);
        //     }, 500);
            
        // })

        // this.apartmentService.add(this.addParams).then(res=>{
        //     console.log(res)
        //     this.router.navigate(['/list/list'])
        // })
        this.router.navigate(['/apartment/list/list'])//test
    }

    handleCancel(e){
        // this.subject.destroy('onCancel');
        history.back()
    }
    
    constructor(private subject:NzModalSubject,
        private fb:FormBuilder,
        private apartmentService:ApartmentService,
        private validatorService:ValidatorService,
        private router:Router){
        this.subject.on('onDestrory',()=>{
            console.log('destroy');
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
    }

    getFormControl(name){
        return this.validateForm.controls[name];
    }
}