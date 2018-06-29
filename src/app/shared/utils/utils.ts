export const utils = {
    transJson(str){
		try{
			JSON.parse(str)
			return JSON.parse(str);
		}catch(e){
			return str;
		}
	},
	transformDateToString(date:Date) {
		if(date){
			return `${date.getFullYear()}-${this.getTempDate((date.getMonth() + 1))}-${this.getTempDate(date.getDate())} ${this.getTempDate(date.getHours())}:${this.getTempDate(date.getMinutes())}:${this.getTempDate(date.getSeconds())}`;
		}else{
			return "";
		}
		
	},
	formatDateTime(time, format) {
		var t = new Date(time);
		var tf = function(i) {
		  return (i < 10 ? '0' : '') + i;
		}
		return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
		  switch(a) {
			case 'yyyy':
			  return tf(t.getFullYear());
			case 'MM':
			  return tf(t.getMonth() + 1);
			case 'dd':
			  return tf(t.getDate());
			case 'HH':
			  return tf(t.getHours());
			case 'mm':
			  return tf(t.getMinutes());
			case 'ss':
			  return tf(t.getSeconds());
		  }
		})
	  },
	getTempDate(param){
		if(param < 10){
			return '0'+param;
	   }else{
			return param;
	   }
	},
	getStatusCode(code){
		code=code+"";
		if(code && code.length>3){
			return code.substr(code.length-3,3)
		}
		return code;
	},
	// webStorage
	getSessionStorage(key){
		return this.transJson(window.sessionStorage.getItem(key))
	},
	removceSessionStorage(key){
		window.sessionStorage.removeItem(key)
	},
	setSessionStorage(key,value){
		if(typeof value =='object'){
			value=JSON.stringify(value);
		}
		window.sessionStorage.setItem(key,value)
	},
	getLocalStorage(key){	
		if(window.localStorage){
			return this.transJson(window.localStorage.getItem(key))
		}
		return this.transJson(window.sessionStorage.getItem(key))
	},
 	setLocalStorage (key,value) {
		if(typeof value =='object'){
			value=JSON.stringify(value);
		}
		if(window.localStorage){
    		window.localStorage.setItem(key, value)
		}else{
			window.sessionStorage.setItem(key, value)
		}
  	},
  	removeLocalStorage(key){
 		if(window.localStorage){
    		window.localStorage.removeItem(key)
		}else{
			window.sessionStorage.removeItem(key)
		} 		
  	},
  	clearLocalStorage(){
  		window.localStorage.clear();
  	},
  	clearSessionStorage(){
  		window.sessionStorage.clear();
  	},
  	clearAllStoarge(){
  		this.clearSessionStorage();
  		this.clearLocalStorage();
	},
	deepCopy(o){
	    if (o instanceof Array) {
	        let n = [];
	        for (let i = 0; i < o.length; ++i) {
	            n[i] = this.deepCopy(o[i]);
	        }
	        return n;

	    } else if (o instanceof Object) {
	        let n = {}
	        for (let i in o) {
	            n[i] = this.deepCopy(o[i]);
	        }
	        return n;
	    } else {
	        return o;
	    }
	},
	pageParams(){
		return {
			pageSize:10,
			currentPage:1
		};
	},
	getNearDay(days: number) {
		let today = new Date();
		let todayMils = today.getTime();
		let startTimeMils = todayMils - days * 24 * 60 * 60 * 1000;
		return {
			startDate: new Date(startTimeMils),
			endDate: today
		}
	},

	// 排序
	compare(str:string,param:string = 'up'){
		return function(obj1, obj2) {
			var value1 = obj1[str]
			var value2 = obj2[str]
			// Date
			if(value1 && value1.getTime){
				value1 = value1.getTime();
			}
			if(value2 && value2.getTime){
				value2 = value2.getTime();
			}
			if (value1 < value2) {
				if(param === 'up'){
					return -1;
				}else{
					return 1;
				}
			} else if (value1 > value2) {
				if(param === 'up'){
					return 1;
				}else{
					return -1;
				}
			} else {
				return 0;
			}
		}
	
	}
}
