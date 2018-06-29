import { Component,Input,OnInit } from "@angular/core";
import { NzModalSubject } from "ng-zorro-antd";
import { FormBuilder,FormGroup,Validators,FormControl } from "@angular/forms";
import { ApartmentService } from "../../apartment.service";
import { ValidatorService } from "../../../../core/validator.service";

@Component({
    selector:'houseEdit-modal-component',
    templateUrl:'./houseEditModal.component.html',
    styleUrls:['../../../../app.component.scss']
})

export class HouseEditModalComponent implements OnInit{
    validateForm: FormGroup;
    _apartmentId:string;
    _id:string;

    isConfirmLoading = false;
    
    @Input()
    set apartmentId(value:string){
        this._apartmentId = value;
    }

    @Input()
    set id(value:string){
        this._id = value;
    }
    housingInfo = {};

    areasNumbers = [];

    getAreasNumbers(){
        for(var i=0; i<=10;i++ ){
            this.areasNumbers.push(i);
        }
    }

    emitDataOutside(){
        this.isConfirmLoading = true;
        this.apartmentService.saveHousing(this.housingInfo).then(res => {
            res["status"] = true;
            setTimeout(() => {
                this.isConfirmLoading = false;
                this.subject.destroy('onCancel');
                this.subject.next(res);
            }, 500);
            
        })
    }

    //获取房源详情
    getHousingDetail(){
        this.apartmentService.getHousingDetail(this._id).then(res => {
            this.housingInfo = res.data;
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
            address:['',[this.validatorService.addressValidator]],
            bedroomNum:[0],
            livingroomNum:[0],
            bathroomNum:[0],
            floorArea:["",[this.validatorService.floorAreaValidator]],
            constructionArea:["",[this.validatorService.floorAreaValidator]],
            floors:[1],
            publicBathroomNum:[0],
            totalPublicArea:[0],
            remark:["",[this.validatorService.remarkValidator]]
        })

        this.getAreasNumbers();
        this.getHousingDetail();
    }

    getFormControl(name){
        return this.validateForm.controls[name];
    }
}