import { Injectable } from '@angular/core';
import { config,service } from '../../core/core.config';
import { AjaxService } from '../../shared/services/ajax.service';
import { utils } from '../../shared/utils/utils';
import { NzMessageService} from 'ng-zorro-antd';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AmapService {
    pageThis = null; // 保存当前页面this
    map = null;  // map实例
    successPointSimplifier = null; // pointSimplifier实例
    cancelPointSimplifier = null; // pointSimplifier实例
    districtExplorer = null; // districtExplorer实例
    infoWindow = null;  // infoWindow实例
    areaNode = null; 
    geolocation = null;    // 定位实例
    polygons = []; // 保存后台数据对应的绘制区域对象
    addPolygons = []; // 保存新增数据对应的绘制区域对象
    province = null; // 保存省list
    city = null;   // 保存市list
    district = null;   // 保存区list
    provinceName = ""; // 保存省名称
    cityName = ""; // 保存市名称
    districtName = ""; // 保存区名称
    polylineEditorObjs = []; // 保存后台数据对应的可编辑的绘制区域编辑对象
    addPolylineEditorObjs = []; // 保存新增数据对应的可编辑的绘制区域编辑对象
    geolocationCenter = null; // 保存定位的中心点LngLat
    selectItems = []; // 保存所勾选的区域对象
    selectRadio = null; // 保存单选的区域对象
    orderInfoList = [];
    I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');

    constructor(private ajaxService : AjaxService,private message: NzMessageService) { }
    
    
    clearAllStore(){
        this.pageThis = null;
        this.map = null;
        this.successPointSimplifier = null;
        this.cancelPointSimplifier = null;
        this.districtExplorer = null;
        this.infoWindow = null;
        this.areaNode = null;
        this.geolocation = null;
        this.polygons = [];
        this.addPolygons = [];
        this.province = null;
        this.city = null;
        this.district = null;
        this.provinceName = "";
        this.cityName = "";
        this.districtName = "";
        this.polylineEditorObjs = [];
        this.addPolylineEditorObjs = [];
        this.geolocationCenter = null;
        this.selectItems = [];
        this.selectRadio = null;
        this.orderInfoList = [];
    }

    clearStore(){
        this.polygons.splice(0,this.polygons.length);
        this.city = null;
        this.district = null;
        this.areaNode = null;
        this.infoWindow = null;
        this.provinceName = "";
        this.cityName = "";
        this.districtName = "";
        this.polylineEditorObjs = [];
        this.selectItems = [];
    }

    // 清除地图上的所有的覆盖物
    clearAllpolygons(){
        for(let item of this.polygons){
            item.content.setMap(null);
        }
    }

    // 清除编辑
    clearPolylineEditorObjs(){
        for(let item of this.polylineEditorObjs){
            item.close();
        }
        this.polylineEditorObjs.splice(0,this.polylineEditorObjs.length);
    }

    // 创建高德地图实例
    create(container,resizeEnable,zoom,center){
        this.clearAllStore();
        return new Promise((resolve,reject) => {
            this.map = new AMap.Map(container,{
                resizeEnable: resizeEnable,
                zoom: zoom,
                center: center,
            });
            if(!this.map){
                reject('err');
                return;
            }
            this.map.plugin(['AMap.ToolBar',"AMap.PolyEditor"],
                () => {
                    var opts = {
                        liteStyle: true
                    }
                    this.map.addControl(new AMap.ToolBar(opts));
                }
            );
            this.infoWindow = new AMap.InfoWindow({});
            resolve(this.map);
        })
    }

    // 搜索相关
    // 引入搜索行政区服务
    IntroduceDistrictExplorer(){
        return new Promise((resolve,reject) => {
            AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer) => {
                //启动页面
                if(!DistrictExplorer || !this.map){
                    reject('err');
                    return;
                }
                this.districtExplorer = new DistrictExplorer({
                    map: this.map, //关联的地图实例
                });
                resolve(this.districtExplorer);
            });
        })
    }
    loadAreaNode(adcode){
        return new Promise((resolve,reject) => {
            this.districtExplorer.loadAreaNode(adcode, (error,areaNode) =>{
                if (error) {
                    reject(error);
                    return;
                }
                let parentFeature = areaNode.getParentFeature();
                let subFeatures = areaNode.getSubFeatures();
                let level = parentFeature.properties.level;
                switch (level) {
                    case 'country':
                        this.province = subFeatures;
                        this.city = null;
                        this.district = null;
                        break;
                    case 'province':
                        // 兼容澳门、及东莞等特殊区域
                        if(subFeatures[0].properties.level == 'city'){
                            this.district = null;
                            this.city = subFeatures;
                        }else if(subFeatures[0].properties.level == 'district'){
                            this.district = subFeatures;
                            this.city = null;
                        }else if(subFeatures[0].properties.level == 'street'){
                            this.district = null;
                            this.city = null;
                        }else{
                            this.district = null;
                            this.city = null;
                        }
                        this.provinceName = parentFeature.properties.name;
                        break;
                    case 'city':
                        if(subFeatures[0].properties.level == 'district'){
                            this.district = subFeatures;
                        }else if(subFeatures[0].properties.level == 'street'){
                            this.district = null;
                        }else{
                            this.district = null;
                        }
                        this.cityName = parentFeature.properties.name;
                        break;
                }
                this.areaNode = areaNode;
                resolve(areaNode);
            })
        })
    }

    // 添加区域
    search(level,feature){
        let arr = [];
        if(feature.properties.childrenNum <= 0){
            var polygonFeature = this.districtExplorer.renderFeature(feature,{
                strokeWeight: 0,
                strokeColor: '#ffffff',
                fillOpacity: 0,
            })
        }else{
            var polygonFeature = this.districtExplorer.renderParentFeature(this.areaNode, {
                strokeWeight: 0,
                strokeColor: '#ffffff',
                fillOpacity: 0,
            });
        }
        for(var i = 0 , len = polygonFeature.length; i < len ; i ++){
            var reArr = this.utilsArray(polygonFeature[i].getPath(),2)
            arr.push(reArr);
        }
        var polygonObjDraw = this.polygonObjDraw(arr,true,true);
        var polygon = polygonObjDraw.polygon;
        var moreThanNumber = polygonObjDraw.moreThanNumber;
        for(let item of this.polygons){
            item.showSelectColor = false;
        }
        for(let item of this.addPolygons){
            item.showSelectColor = false;
        }
        switch (level) {
            case 'province':
                this.addPolygons.push({
                    name: this.provinceName,
                    content: polygon,
                    status: 1,
                    showInput: false,
                    deleteStatus: false,
                    moreThanNumber: moreThanNumber,
                    showSelectColor: true
                })
                break;
            case 'city':
                this.addPolygons.push({
                    name: this.provinceName + this.cityName,
                    content: polygon,
                    status: 1,
                    showInput: false,
                    deleteStatus: false,
                    moreThanNumber: moreThanNumber,
                    showSelectColor: true
                })
                
                break;
            case 'district':
                this.addPolygons.push({
                    name: this.provinceName  + this.cityName + this.districtName,
                    content: polygon,
                    status: 1,
                    showInput: false,
                    deleteStatus: false,
                    moreThanNumber: moreThanNumber,
                    showSelectColor: true
                })
                
                break;
        }
        this.map.setFitView();//地图自适应
    }


    // 定位相关
    position(mapObj){
        mapObj.plugin('AMap.Geolocation',  () => {
            var geolocationCenter = utils.getSessionStorage('geolocationCenter');
            this.geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(14, 130),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            mapObj.addControl(this.geolocation);
            if(geolocationCenter){
                this.geolocationCenter = geolocationCenter;
                mapObj.setZoomAndCenter(18,[geolocationCenter.lng,geolocationCenter.lat]);
                return;
            }
            this.geolocation.getCurrentPosition((status,result) => {
                if(status == 'complete'){
                    this.geolocationCenter = result.position;
                    utils.setSessionStorage('geolocationCenter',this.geolocationCenter);
                }else{
                    this.message.create('error', '定位失败');
                    mapObj.setZoomAndCenter(18,[116.396749,39.918055]);
                }
            });
            
        });
    }

    // polygon对象绘制多边形
    // path: [[lng,lat]] or [[[lng,lat]]]  param: true 可编辑  false 不可编辑

    polygonObjDraw(path,param,add){
        var polygon = new AMap.Polygon({
            map: this.map,
            strokeWeight: 1,
            strokeColor: '#3aa1fb',
            fillColor: '#acd5f6',
            fillOpacity: 0.6,
            path: path

        });
        var moreThanNumber = false;
        // 如果不是新增页面则不编辑也不拖拽 再判断点数
        // console.log(this.judgementPointNumber(path))
        if(param){
            if(this.judgementPointNumber(path)){
                polygon.setOptions({
                    draggable: true
                })
                this.polyEditor(polygon,add);
                moreThanNumber = false;
            }else{
                moreThanNumber = true;
            }
        }
        var uuid = this.getUniqueId();
        polygon.setExtData({id: uuid})
        // 点数较多的多边形无法绑定click事件
        polygon.on('click',(res) => {
            
            for(let item of this.polygons){
                item.showSelectColor = false;
                if(item.content.getExtData().id == res.target.getExtData().id){
                    item.showSelectColor = true;
                    if(item.id){
                        this.selectRadio.id = item.id;
                    }
                }
            }

            for(let item of this.addPolygons){
                item.showSelectColor = false;
                if(item.content.getExtData().id == res.target.getExtData().id){
                    item.showSelectColor = true;
                }
            }
            
            this.map.setZoomAndCenter(this.getAbs(res.target),this.getPolygonObjCenter(res.target));
            utils.setSessionStorage('polygonUuidSessionStorage','');
        })
        polygon.on('change',(res) => {
            var polygonUuidSessionStorage = utils.getSessionStorage('polygonUuidSessionStorage');
            if(res.target.getExtData().id == polygonUuidSessionStorage){
                return;
            }else{
                
                for(let item of this.polygons){
                    item.showSelectColor = false;
                    if(item.content.getExtData().id == res.target.getExtData().id){
                        item.showSelectColor = true;
                        if(item.id){
                            this.selectRadio.id = item.id;
                        }
                    }
                }
    
                for(let item of this.addPolygons){
                    item.showSelectColor = false;
                    if(item.content.getExtData().id == res.target.getExtData().id){
                        item.showSelectColor = true;
                    }
                }
                utils.setSessionStorage('polygonUuidSessionStorage',res.target.getExtData().id);
            }
            
        })
        return {
            polygon: polygon,
            moreThanNumber: moreThanNumber
        };
    }


    // 关闭编辑 
    // item: this.polygons[n]  index: 处理过后的下标
    editClose(item,index){
        if(item.id && this.polylineEditorObjs.length > 0 && !item.moreThanNumber){
            this.polylineEditorObjs[index].close();
            this.polylineEditorObjs.splice(index,1);
        }else if(!item.id && this.addPolylineEditorObjs.length > 0 && !item.moreThanNumber){
            this.addPolylineEditorObjs[index].close();
            this.addPolylineEditorObjs.splice(index,1);
        }
    }

    // 清除绘制
    // item: this.polygons[n]  index: 处理过后的下标
    clearArea(item,index){
        //index需要做处理  判断在这个index之前有几个是行政区绘制算出真实的编辑绘制index
        this.editClose(item,index);
        item.content.setMap(null);
    }
    // 编辑多边形
    // obj: polygon对象
    polyEditor(obj,param){
        // 如果说是点击某个列表再实例化编辑  那么可以用变量来保存该编辑对象，而不需要数组
        var polylineEditor = new AMap.PolyEditor(this.map,obj);
        if(param){
            this.addPolylineEditorObjs.push(polylineEditor)
        }else{
            this.polylineEditorObjs.push(polylineEditor)
        }
        polylineEditor.open(); 
    }


    // 获取区域面积的绝对值并根据该值判断合适的缩放层级
    // obj: polygon对象

    getAbs(obj){
        var abs = Math.abs(obj.getArea()/1000000);
        if(abs <= 0.1){
            return 17;
        }else if(abs > 0.1 && abs <= 1){
            return 16;
        }else if(abs > 1 && abs < 4){
            return 15;
        }else if(abs > 4 && abs < 25){
            return 14;
        }else if(abs > 25 && abs < 100){
            return 13;
        }else if(abs > 100 && abs < 300){
            return 12;
        }else if(abs > 300 && abs < 2000){
            return 11;
        }else if(abs > 2000 && abs < 5000){
            return 10;
        }else if(abs > 5000 && abs < 10000){
            return 9;
        }else if(abs > 10000 && abs < 200000){
            return 8;
        }else if(abs > 200000 && abs < 300000){
            return 7;
        }else if(abs > 300000 && abs < 1000000){
            return 6;
        }else{
            return 5;
        }
        
    }

    //将对象数组转化为二维数组  将二维对象数组转化为三维数组
    // arr: [LngLat] or [[LngLat]]
    utilsArray = function(arr,type){
        var newArr = [];
        if(arr[0] instanceof Array){
            // 二维对象数组
            for(var k = 0 , len1 = arr.length; k < len1 ; k ++){
                if(type == 3){
                    var arrS = [];
                    newArr.push(arrS)
                }
                for(var l = 0 , len2 = arr[k].length ; l < len2 ; l++){
                    if(type == 3){
                        arrS.push([arr[k][l].lng,arr[k][l].lat])
                    }else{
                        newArr.push([arr[k][l].lng,arr[k][l].lat])
                    }
                    
                }
            }
        }else if(arr[0] instanceof Object){
            // 对象数组
            for(var k = 0 , len1 = arr.length; k < len1 ; k ++){
                newArr.push([arr[k].lng,arr[k].lat])
            }
        }
        return newArr;
    }

    // 得到以地图中心点为中心的四边形
    defaultPolygonObj(map){
        var mapCenter = map.getCenter();
        var mapCenterLTX = mapCenter.lng - 0.003;
        var mapCenterLTY = mapCenter.lat - 0.003;
        var mapCenterRTX = mapCenter.lng + 0.003;
        var mapCenterRTY = mapCenter.lat - 0.003;
        var mapCenterLBX = mapCenter.lng - 0.003;
        var mapCenterLBY = mapCenter.lat + 0.003;
        var mapCenterRBX = mapCenter.lng + 0.003;
        var mapCenterRBY = mapCenter.lat + 0.003;
        var path = [[mapCenterLTX,mapCenterLTY],[mapCenterLBX,mapCenterLBY],[mapCenterRBX,mapCenterRBY],[mapCenterRTX,mapCenterRTY]]
        var polygonObjDraw = this.polygonObjDraw(path,true,true);
        var polygon = polygonObjDraw.polygon;
        var moreThanNumber = polygonObjDraw.moreThanNumber;
        for(var i = 0 , len = this.polygons.length; i < len ; i ++){
            this.polygons[i].showSelectColor = false;
        }
        for(var j = 0 , len1 = this.addPolygons.length; j < len1 ; j ++){
            this.addPolygons[j].showSelectColor = false;
        }
        this.addPolygons.push({
            name: "区域" + (this.polygons.length + this.addPolygons.length + 1),
            content: polygon,
            status: 1,
            showInput: false,
            deleteStatus: false,
            moreThanNumber: moreThanNumber,
            showSelectColor: true
        })
        map.setZoomAndCenter(16,[mapCenter.lng,mapCenter.lat]);
    }


    // 如果多边形的path 点数大于100 那么则返回false; 用于之后判断多边形是否能编辑和拖拽  目前已知的是澳门圣方济各堂区最少  52个点
    // arr: [LngLat] or [[LngLat]]

    judgementPointNumber(arr){
        if(arr[0] instanceof Array){
            var count = 0;
            for(var k = 0 , len = arr.length; k < len ; k ++){
                count += arr[k].length;
            }
            if(count > 100){
                return false;
            }else{
                return true;
            }
        }else if(arr[0] instanceof Object){
            if(arr.length > 100){
                return false;
            }else{
                return true;
            }
        }
    }

    // 将字符串转换成hash值 方便之后对比path是否相等  判断区域是否进行了修改 
    parseHash(param){
        var paramJson = JSON.stringify(param);
        var hash = 5381;
        var i = paramJson.length - 1;
        if(typeof paramJson == 'string'){
            for (; i > -1; i--)
            hash += (hash << 5) + paramJson.charCodeAt(i);
        }
        var value = hash & 0x7FFFFFFF;
        var retValue = '';
        do{
            retValue += this.I64BIT_TABLE[value & 0x3F];
        }
        while(value >>= 6);
        
        return retValue;
    }

    // 粗略获取多边形中心点
    // obj: polygon对象

    getPolygonObjCenter(obj){
        var arr = obj.getPath()
        if(arr[0] instanceof Array){
            var arrSort = [];
            for(var i = 0 , len1 = arr.length; i < len1 ; i ++){
                arrSort.push(arr[i].length);
            }
            var reArr = arrSort.sort(function(a,b){
                return a - b;
            })
            for(var j = 0 , len2 = arr.length; j < len2 ; j ++){
                if(arr[j].length == reArr[reArr.length - 1]){
                    var len = arr[j].length;
                    var lastArr = arr[j];
                    break;
                }
            }
            // 判断奇偶
            if(len % 2 == 0){
                var arrCenter = lastArr[len / 2];
            }else{
                var arrCenter = lastArr[(len + 1) / 2];
            }
            var arr0X = lastArr[0].lng;
            var arr0Y = lastArr[0].lat;
            var arr0CenterX = arrCenter.lng;
            var arr0CenterY = arrCenter.lat;
        }else if(arr[0] instanceof Object){
            var len = arr.length;
            if(len % 2 == 0){
                var arrCenter = arr[len / 2];
            }else{
                var arrCenter = arr[(len + 1) / 2];
            }
            var arr0X = arr[0].lng;
            var arr0Y = arr[0].lat;
            var arr0CenterX = arrCenter.lng;
            var arr0CenterY = arrCenter.lat;
        }
        return [(arr0X + arr0CenterX) / 2,(arr0Y + arr0CenterY) / 2]
    }

    // 生成uuid

    getUniqueId(){
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c =='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;		
    }

    // 关键字查询接口
    searchPOIsByKeyword(keywords){
        let url = `${service.appBackground}/poi/searchPOIsByKeyword?keywords=${keywords}`;
		return this.ajaxService.get(url);	
    }
}
