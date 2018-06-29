import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { utils } from '../../utils/utils';
import { config, service } from '../../../core/core.config';
import { AjaxService } from '../../../shared/services/ajax.service';
import { HttpParams } from "@angular/common/http";
import { CodeHelperService } from '../../../core/code-helper.service';


@Component({
    selector: 'custom-cities-select',
    templateUrl: './custom-cities-select.component.html',
    styleUrls: ['./custom-cities-select.component.scss'],
})
export class CustomCitiesSelectComponent implements OnChanges {
    constructor(
        private ajaxService: AjaxService,
        private codeHelperService: CodeHelperService
    ) {

    }

    private allCitiesAPI = service.commonService + '/background-manage/administrative-region/findAllProvinceAndCity';
    private getChildAPI = service.commonService + '/background-manage/administrative-region/listCityAllChildren'

    // 如果为空则自动请求
    @Input() nodes: any[] = [];
    options: any = {};
    // 是否加载区、街道
    @Input() isMoreLevel: boolean = false;

    @Output() csChange: EventEmitter<any> = new EventEmitter();
    @Output() csSelectedCites = new EventEmitter();

    childNodes = [];

    onEvent(ev) {
        this.csChange.emit(this.nodes);
        this.csSelectedCites.emit(this.getSelectedCities(this.nodes || []));
    }

    getAllCities() {
        this.ajaxService.get(this.allCitiesAPI).then((resp) => {
            if (!this.codeHelperService.isServerError(resp)) {
                this.nodes = this.configNodes(resp.data);
                this.configMoreLevel(this.nodes);
                utils.setLocalStorage('lfAllCities', this.nodes);
            } else {
                console.log(resp);
            }
        }).catch(err =>{
            console.log(err);
        });
    }

    getChild(id: string): Promise<any> {
        return this.ajaxService.get(this.getChildAPI + '?cityId=' + id)
    }

    configNodes(datas: Array<any>): Array<any> {
        var provinces = datas.filter(item => item.level === 1);
        var cities = datas.filter(item => item.level === 2);
        provinces.forEach((value, index) => {
            value['children'] = cities.filter(item => item.parentId === value.id);
            if (value.children.length) {
                value['hasChildren'] = true;
            }
        })
        return provinces;
    }

    configMoreLevel(datas: Array<any>): void {
        datas.forEach(value => {
            if (value.hasChildren) {
                value.children.forEach(element => {
                    element['hasChildren'] = true;
                });
            }
        })
    }

    configChildNodes(datas: Array<any>): Array<any> {
        var level3 = datas.filter(item => item.level === 3);
        var level4 = datas.filter(item => item.level === 4);
        level3.forEach((value, index) => {
            value['children'] = level4.filter(item => item.parentId === value.id);
            if (value.children.length) {
                value['hasChildren'] = true;
            }
        })
        return level3;
    }

    getSelectedCities(nodes: Array<any>): Array<any> {
		if (!nodes || nodes.length === 0) {
			return [];
		}
		var tmpArr = [];
		nodes.forEach(level1 => {
			if (level1.checked) {
				tmpArr.push({
					id: level1.id,
					level: level1.level
				});
			}
			if ((level1.checked || level1.halfChecked) && level1.hasChildren && level1.children && level1.children.length) {
				var subTmpArr = this.getSelectedCities(level1.children) || [];
				subTmpArr.forEach(level2 => {
					tmpArr.push({
						id: level2.id,
						level: level2.level
					});
				})
			}
		});
		return tmpArr;
	}

    ngOnChanges(changes: SimpleChanges): void {
        if ('nodes' in changes || 'isMoreLevel' in changes) {
            if (this.isMoreLevel) {
                this.options = {
                    getChildren: (node: any) => {
                        return new Promise((resolve, reject) => {
                            this.getChild(node.id).then((resp) => {
                                if (!this.codeHelperService.isServerError(resp)) {
                                    resolve(this.configChildNodes(resp.data));
                                } else {
                                    console.log(resp);
                                }
                            }).catch(err =>{
                                console.log(err);
                            });
                        })
                    }
                }
            }
            if (!this.nodes.length) {
                var nodes = utils.getLocalStorage('lfAllCities');
                if (!nodes) {
                    this.getAllCities();
                } else {
                    this.nodes = nodes;
                    this.configMoreLevel(this.nodes);
                }
            } else {
                this.nodes = this.configNodes(this.nodes);
                this.configMoreLevel(this.nodes);
            }
        }
    }
}