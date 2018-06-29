import { Component,Input,OnInit } from "@angular/core";
import { NzModalSubject } from "ng-zorro-antd";
import { FormBuilder,FormGroup,Validators,FormControl } from "@angular/forms";
import { ApartmentService } from "../apartment.service";
import { ValidatorService } from "../../../core/validator.service";

@Component({
    selector:'edit-modal-component',
    templateUrl:'./editModal.component.html',
    styleUrls:['../../../app.component.scss']
})

export class EditApartmentModalComponent implements OnInit{
    validateForm: FormGroup;
    _id:string;
    isConfirmLoading = false;
    apartmentInfo = {};
    
    @Input()
    set id(value:string){
        this._id = value;
    }
    emitDataOutside(){
        this.isConfirmLoading = true;
        this.apartmentService.saveApartmentDetail(this.apartmentInfo).then(res => {
            res["status"] = true;
            setTimeout(() => {
                this.isConfirmLoading = false;
                this.subject.destroy('onCancel');
                this.subject.next(res);
            }, 500);
            
        })
    }

    handleCancel(e){
        this.subject.destroy('onCancel');
    }

    constructor(private subject:NzModalSubject,private fb:FormBuilder,private apartmentService:ApartmentService,private validatorService:ValidatorService){
        this.subject.on('onDestrory',()=>{
            console.log('destroy');
        })
    }
    ngOnInit(){
        this.validateForm = this.fb.group({
            contact:["",[this.validatorService.contactValidator]],
            phone:["",[this.validatorService.phoneValidator]],
        })
        this.apartmentService.getApartmentDetail(this._id).then(res => this.apartmentInfo = res.data)
    }

    getFormControl(name){
        return this.validateForm.controls[name];
    }
}