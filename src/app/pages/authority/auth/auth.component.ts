import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { NzMessageService,NzModalService} from 'ng-zorro-antd';
import { config, service } from '../../../core/core.config';
import { utils } from '../../../shared/utils/utils';
import { AuthorityService } from "../authority.service";


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
	userId = sessionStorage.getItem("userId");
  list = [];
  authList = [];
  currentItem = {};
		
  constructor(private authorityService:AuthorityService,private fb: FormBuilder,private message: NzMessageService,private modal: NzModalService) { }

  ngOnInit() {
  	this.getAuthGroup();
  }
  getAuthGroup(){  
    this.authorityService.getAuthGroupList().then(res=>{
      console.log(res)
      this.list=res.data;
      this.currentItem=res.data[0];
      this.getAuthList(res.data[0])
    })
  }
  getAuthList(item){
    this.currentItem = item;
    this.authorityService.getAuthGroupAuthListByGroupId(item.id).then(res=>{
      console.log(res)

      this.authList = res.data;
    })    
  }
 
  delete(){

  }
  cancel(){

  }
  update(){

  }

}
