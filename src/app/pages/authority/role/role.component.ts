import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { NzMessageService,NzModalService} from 'ng-zorro-antd';
import { config, service } from '../../../core/core.config';
import { utils } from '../../../shared/utils/utils';
import { AuthorityService } from "../authority.service";
import { RoleEditModalComponent } from "./edit-role-modal.component";

console.log(AuthorityService)
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
	userId = sessionStorage.getItem("userId");
	page = {
		currentPage:1,
		totalCount:0,
		pageSize:10
	}
	roleList = [];
	menuList = [];
	roleMenuList = [];
	currentItem = {id:''};
	checkboxData = {
		roleId:'',
		menuIds:[]
	};
	selectAll = false;
		
  constructor(private authorityService:AuthorityService,private fb: FormBuilder,private message: NzMessageService,private modal: NzModalService) { }

  ngOnInit() {
  	// this.getRoleList();
  }

  getRoleList(type:any){
    if(type==0){
      this.page.currentPage=1;
    }
    console.log('this.page',this.page.currentPage)
  	this.authorityService.getRoleList({page:this.page}).then(res=>{
  		if(utils.getStatusCode(res.code) == config.successCode){
  			this.roleList = res.data;
  			this.page.totalCount = res.page.totalCount;
  			this.currentItem = res.data[0];
  			this.getMenuListById(res.data[0]);
  		}
  	})
  }
  getMenuListById(item){
  	this.currentItem = item;
  	let id = item.id;
  	this.authorityService.getMenuList(this.userId).then(res=>{
  			this.menuList = res;
  			this.authorityService.getMenuWithRoleId(this.userId,id).then(result=>{
  				this.roleMenuList = result.data;
				this.checkboxData = {
					roleId:id,
					menuIds:[]
				}
                for(var i=0;i<this.roleMenuList.length;i++){
                    if(this.roleMenuList[i].isSelected==true){
                        for(var b=0;b<this.menuList.length;b++){
                            for(var s=0;s<this.menuList[b].subMenus.length;s++){
                                if(this.menuList[b].subMenus[s].id==this.roleMenuList[i].menuId){
                                    this.menuList[b].subMenus[s].isSelected=true;
                                    this.checkboxData.menuIds.push(this.roleMenuList[i].menuId);
                                    this.checkboxData.menuIds.push(this.menuList[b].id);
                                }
                            }
                        }
                    }
                } 
                let count = 0;
                for(let j=0;j<this.roleMenuList.length;j++){
                	if(this.roleMenuList[j].isSelected){
                		count+=1;
                	}
                }
                if(count == this.roleMenuList.length){
                	this.selectAll = true;
                }else{
                	this.selectAll = false;
                }
  			})
  	})
  }
  saveAuthData(){
  	let data = {
  		roleId:this.currentItem.id,
  		menuIds:[]
  	}
  	for(let i=0;i<this.menuList.length;i++){
  		let flag = false,
  			current = this.menuList[i].subMenus;
  		for(let j=0;j<current.length;j++){
  			if(current[j].isSelected){
  				flag = true;
  				data.menuIds.push(current[j].id)
  			}
  		}
  		if(flag){
  			data.menuIds.push(this.menuList[i].id);
  		}
  	}
  	if(data.menuIds.length == 0){
  		this.message.create('error', '请勾选，再提交！');
  	}else{
  		this.authorityService.saveMenu(data).then(res=>{
  			this.message.success(res.msg);
  		},err=>{
  			this.message.error('网络连接失败')
  		})
  	}
  }
  toggle(item){
  	let count = 0, allCount = 0;
  	for(let i=0;i<this.menuList.length;i++){
  		let current = this.menuList[i].subMenus;
  		for(let j=0;j<current.length;j++){
  			allCount+=1;
  			if(current[j].isSelected){
  				count+=1;
  			}
  		}
  	}  	
	if(count == allCount){
		this.selectAll = true;
	}else{
		this.selectAll = false;
	}
  }
  toggleAll(){
  	if(!this.selectAll){
  		for(let i = 0;i<this.menuList.length;i++){
  			for(let j = 0;j<this.menuList[i].subMenus.length;j++){
  				this.menuList[i].subMenus[j].isSelected = false;
  			}
  		}
  		this.checkboxData.menuIds=[];
  	}else{
  		this.selectAll = true;
  		for(let i = 0;i<this.menuList.length;i++){
  			for(let j = 0;j<this.menuList[i].subMenus.length;j++){
  				this.menuList[i].subMenus[j].isSelected = true;
  				this.checkboxData.menuIds.push(this.menuList[i].subMenus[j].id);
  				this.checkboxData.menuIds.push(this.menuList[i].subMenus[j].parentId);
  			}
  		}
  	}
  }
  editRole(item){
    const subscription = this.modal.open({
      title: '修改资料',
      content: RoleEditModalComponent,
      onOk() {
      },
      onCancel() {

      },
      footer: false,
      componentParams: {
        id:item.id,
        name:item.name,
        type:0
      }
    });
    subscription.subscribe(result => {
      if (result === 'onOk') {
        this.getRoleList(1)
      }
    })
  }
  addRole(){
    const subscription = this.modal.open({
      title: '添加角色',
      content: RoleEditModalComponent,
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
        this.getRoleList(0)
      }
    })    
  }
  delete(item){
    console.log(item)
    this.authorityService.roleDelete(item.id).then(res=>{
        if(res.code==200){
          this.message.create('success', '删除成功');
          this.getRoleList(1)
        }else{
          this.message.error('删除失败')
        }

    }, err=>{
       this.message.error('网络连接失败')
    })    
  }
  cancel(){
    return;
  }
}
