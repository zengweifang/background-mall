import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ModalTextComponent } from './../modalText.component';
import { BaseService } from '../base-attribute.service';
import { Router } from '@angular/router';
import { AttributeBase, AttributeObj,AttributeValueDTO} from './../base-attribute';
import { MetaData } from '../../../../shared/class/mete-data'
@Component({
	selector: 'app-base-attribute-add',
	templateUrl: './base-attribute-add.component.html',
	styleUrls: ['./base-attribute-add.component.css']
})
export class BaseAttributeAddComponent implements OnInit {
	attributeGroup:AttributeBase;
	//元数据对象
	metaData: MetaData;

	constructor(
		private message: NzMessageService,
		private modalService: NzModalService,
		private BaseService: BaseService,
		private router: Router) {
			//初始化
			this.attributeGroup = new AttributeBase('',[{
				required:false,
				scope:0,
				title:'',
				attrType:0,
				attributeValueDTOList:[
					{
						content : null,
						textConstraintType : 0,
						sort:1
					}
				],
				timeScope:0
			}])

			this.metaData = {
				attrTypes : [{ id: 0, name: '单行文本框' }, { id: 1, name: '下拉菜单' }, { id: 2, name: '时间控件' }],
				timeScopes : [{ id: 1, name: '精确到时' }, { id: 2, name: '精确到天' }, { id: 3, name: '精确到月' }, { id: 0, name: '精确到分' }],
				scopes : [{ id: 0, name: '供应商' }, { id: 1, name: '用户' }],
				textConstraintTypes : [{ id: 0, name: '无限制' }, { id: 1, name: '手机' }, { id: 2, name: '身份证' }, { id: 3, name: '邮箱' }, { id: 4, name: '姓名' }, { id: 5, name: '正则表达式' }],
				status : [{id:0,name:'关闭'},{id:1,name:'待开启'},{id:2,name:'开启'}]
			}
	}

	ngOnInit() {
	}

	cancel() {
		this.message.info('取消任务！')
	}

	confirm(index) {
		this.attributeGroup.attributeDefineDTOList.splice(index, 1);
	}

	save() {
		this.BaseService.saveBaseData(this.attributeGroup).then(() => this.router.navigate(['/basicData/attribute/list/list']))
	}

	add() {
		this.attributeGroup.attributeDefineDTOList.push({
			required:false,
			scope:0,
			title:'',
			attrType:0,
			attributeValueDTOList:[
				{
					content : null,
					textConstraintType : 0,
					sort:1
				}
			],
			timeScope:0
		});
	}

	showModalForComponent(data) {

		const subscription = this.modalService.open({
			title: '对话框标题',
			content: ModalTextComponent,
			onOk() {
				return new Promise((resolve) => {
					setTimeout(resolve, 1000);
				});
			},
			onCancel() {
				// console.log('Click cancel');
			},
			footer: false,
			componentParams: {
				data: data.attributeValueDTOList//传出参数
			}
		});
		subscription.subscribe(result => {
			// console.log(result)

		})
	}




}
