import { Component, OnInit } from '@angular/core';

import { SiderService } from './sider.service';
import { utils } from '../../shared/utils/utils';
import { Menu } from './menu';
import { Router } from '@angular/router';
import { Store } from "@ngrx/store";
import { Observable } from 'rxjs/Observable';
import { LOGIN, LOGOUT } from "../../shared/reducer/login";

interface AppState {
	login: boolean;
	pageLoading: boolean
}

@Component({
	selector: 'app-sider',
	templateUrl: './sider.component.html',
	styleUrls: ['./sider.component.scss']
})
export class SiderComponent implements OnInit {
	// menu: Menu[] = [];
	menu = [
		{
			name:'尊享vip后台',
			subMenus:[
				{
					name:'banner图',
					url:'#/banner/list/list'
				},
				{
					name:'九宫格',
					url:'#/clubs/list/list'
				},
				{
					name:'运营类目',
					url:'#/category/list/list'
				},
				{
					name:'基础类目',
					url:'#/base/list/list'
				},
				{
					name:'商品池',
					url:'#/commoditypools/list/list'
				}
			]
		}
	];
	visible: boolean;
	isCollapsed = false;
	userName = '';
	login: Observable<boolean>;
	isLogin: boolean;
	_spinningOb: Observable<boolean>;
	_spinning: boolean;
	constructor(private siderService: SiderService, private router: Router, private store: Store<AppState>) { 
		this.login = store.select('login');
		this._spinningOb = store.select('pageLoading');
	}


	ngOnInit() {
		// const userId =  utils.getSessionStorage('userId');
		var userId = true;
		if (userId) {
			this.isLogin = true;
			this.store.dispatch({type: LOGIN});
		}
		this.login.subscribe(res => {
			console.log(res);
			this.isLogin = res;
			this.userName = utils.getSessionStorage('userName');
			// if (res) {
			// 	this.getMenu();
			// }
		});

		this._spinningOb.subscribe(res => {
			setTimeout(() => {
				this._spinning = res;
			}, 0);
		});
	}

	// getMenu(): void {
	// 	const userId =  utils.getSessionStorage('userId');
	// 	this.siderService.getMenu(userId)
	// 		.then(response => this.menu = response)
	// }

	clickMe(): void {
		this.store.dispatch({type: LOGOUT})
		utils.clearAllStoarge();
		this.visible = false;
		this.router.navigate(['/login']);
	}

	go(item){
		var value1 =item.url.split('#')[1];
		var value2 = value1.split('?')[0];
		this.router.navigate([value2]);
	}
}