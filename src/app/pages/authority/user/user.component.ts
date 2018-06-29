import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { NzMessageService,NzModalService} from 'ng-zorro-antd';
import { config, service } from '../../../core/core.config';
import { utils } from '../../../shared/utils/utils';
import { AuthorityService } from "../authority.service";
import { UserEditModalComponent } from "./edit-user-modal.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
	userId = sessionStorage.getItem("userId");
	userList = [];
  authList = [];
  currentItem :any;
	params = {
		page: {
			currentPage:1,
			totalCount:0,
			pageSize:10
		},
		filter:{
			userName:''
		}	
	}
  selectAll = false;
		
  constructor(private authorityService:AuthorityService,private fb: FormBuilder,private message: NzMessageService,private modal: NzModalService) { }

  ngOnInit() {
  	// this.getRoleList();
  }
  getAuthList(item){
    this.authorityService.getRoleListWithUserId(item.userId).then(res=>{
        if(res.code==200){
           this.authList = res.data;
           var flag = true;
           for(var i=0;i<res.data.length;i++){
             if(!res.data[i].isSelected){
                flag = false;
             }
           }
           this.selectAll = flag;
        }
    }, err=>{
       this.message.error('网络连接失败')
    }) 
  }

  getUserList(type){
    if(type==0){
      this.params.page.currentPage=1;
    }
    this.selectAll = false;
    this.authorityService.getUserList(this.params).then(res=>{
    	this.userList = res.data;
      this.currentItem = res.data[0];
      this.getAuthList(this.currentItem);
    	this.params.page.totalCount=res.page.totalCount;
	});
  }

  cancel(){
    return;
  }
  edit(item){
    const subscription = this.modal.open({
      title: '修改资料',
      content: UserEditModalComponent,
      onOk() {
      },
      onCancel() {

      },
      footer: false,
      componentParams: {
        item:item,
        type:0
      }
    });
    subscription.subscribe(result => {
      if (result === 'onOk') {
        this.getUserList(1)
      }
    })
  }
  add(){
    const subscription = this.modal.open({
      title: '新増用户',
      content: UserEditModalComponent,
      onOk() {
      },
      onCancel() {

      },
      footer: false,
      componentParams: {
        type:1
      }
    });
    subscription.subscribe(result => {
      if (result === 'onOk') {
        this.getUserList(0)
      }
    })    
  }
  delete(item){
    this.authorityService.userDelete(item.userId).then(res=>{
        if(res.code==200){
          this.message.create('success', '删除成功');
          this.getUserList(1);
        }else{
          this.message.error('删除失败')
        }

    }, err=>{
       this.message.error('网络连接失败')
    })     
  }
  selItem(item){
    this.currentItem=item;
    this.getAuthList(item);
  }
  toggleAll(){
    for(var i=0;i<this.authList.length;i++){
      this.authList[i].isSelected = this.selectAll;
    }
  }
  saveAuthData(){
    var arr=[];
    for(var i=0;i<this.authList.length;i++){
      if(this.authList[i].isSelected){
        arr.push(this.authList[i].id);
      }
    }
    this.authorityService.saveUserRole({roleIds:arr,userId:this.currentItem.userId}).then(res=>{
        this.message.success(res.msg);
        this.getUserList(1)
      },err=>{
        this.message.error('网络连接失败')
      })
  }
}
