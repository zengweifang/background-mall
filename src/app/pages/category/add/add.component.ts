import { Component,Input,OnInit } from "@angular/core";
import { NzModalSubject } from "ng-zorro-antd";
import { FormBuilder,FormGroup,Validators,FormControl } from "@angular/forms";
import { CategoryService } from "../category.service";
import { ValidatorService } from "../../../core/validator.service";
import { Router } from '@angular/router';

@Component({
    selector:'add-category-component',
    templateUrl:'./add.component.html',
    styleUrls:['../../../app.component.scss']
})

export class AddCategoryComponent implements OnInit{
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
        // this.CategoryService.addApartment(this.apartmentInfo).then(res => {
        //     res["status"] = true;
        //     setTimeout(() => {
        //         this.isConfirmLoading = false;
        //         this.subject.destroy('onCancel');
        //         this.subject.next(res);
        //     }, 500);
            
        // })

        // this.CategoryService.add(this.addParams).then(res=>{
        //     console.log(res)
        //     this.router.navigate(['/list/list'])
        // })
        this.router.navigate(['/category/list/list'])//test
    }

    handleCancel(e){
        // this.subject.destroy('onCancel');
        history.back()
    }
    
    constructor(private subject:NzModalSubject,
        private fb:FormBuilder,
        private CategoryService:CategoryService,
        private validatorService:ValidatorService,
        private router:Router){
        this.subject.on('onDestrory',()=>{
            console.log('destroy');
        })
    }
    
    ngOnInit(){
        this.validateForm = this.fb.group({
            name:["",[this.validatorService.nameValidator]],
            sort:["",[this.validatorService.nameValidator]]
        })
    }

    getFormControl(name){
        return this.validateForm.controls[name];
    }
}