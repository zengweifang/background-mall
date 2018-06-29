import { Component,Input,OnInit } from "@angular/core";
import { NzModalSubject } from "ng-zorro-antd";
import { FormBuilder,FormGroup,Validators,FormControl } from "@angular/forms";
import { ApartmentService } from "../../apartment.service";
import { ValidatorService } from "../../../../core/validator.service";

@Component({
    selector:'houseAdd-modal-component',
    templateUrl:'./houseAddModal.component.html',
    styleUrls:['../../../../app.component.scss']
})

export class HouseAddModalComponent implements OnInit{
    validateForm: FormGroup;
    _apartmentId:string;

    isConfirmLoading = false;
    lockPlatforms = [{id: null,label: '无'},{id: 'yunding',label: '云丁'}]
    
    @Input()
    set apartmentId(value:string){
        this._apartmentId = value;
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
        this.apartmentService.addHousing(this.housingInfo).then(res => {
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
            address:['',[this.validatorService.addressValidator]],
            bedroomNum:[0],
            livingroomNum:[0],
            bathroomNum:[0],
            floorArea:["",[this.validatorService.floorAreaValidator]],
            constructionArea:["",[this.validatorService.floorAreaValidator]],
            floors:[1],
            publicBathroomNum:[0],
            totalPublicArea:[0],
            apartmentLockCode:[undefined],
            remark:["",[this.validatorService.remarkValidator]]
        })

        this.getAreasNumbers();
        this.housingInfo = {
            apartmentId:this._apartmentId,
            floors:1,//是否室复式
            publicBathroomNum:0,//公共厕所数量
            bedroomNum:0,//室
            livingroomNum:0,//厅
            bathroomNum:0,//卫
            totalPublicArea:0,//公区数量
            apartmentLockCode:undefined
        }
    }

    getFormControl(name){
        return this.validateForm.controls[name];
    }
}