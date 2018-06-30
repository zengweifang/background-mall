let config = {
    pvResponse: 100,
    successCode: 200,
    redirect: 300,
    clientError: 400,
    serviceError: 500,
    paramsError: 600,
    domain: ".wang-guanjia.com",
    clientId: "cebbdd36546f41d48a0363fc90d48aa3",
    clientSecret: "x09Lha46Bn7IHCZWdWzwVEy4Wmrl7F7f"
}

let service = {
    commonService: '',
    oauthUrl: '',
    resourceService: '',
    uploadUrl: '',
    uploadReturnUrl: '',
    staticUrl: '',
    downUrl: '',
    appBackground: ''
}

let currentUrl = location.hostname;
let localhost="localhost";
let test ="test.wang-guanjia.com";
let dev='development.wang-guanjia.com';
let pre_product = "p-app.wang-guanjia.com";
let pre_product_api = "p-api.wang-guanjia.com";
let product = "app.wang-guanjia.com";
let product_api = "api.wang-guanjia.com";
// currentUrl = test;
switch(currentUrl){
    case localhost:
        service.commonService = 'https://zunxiangviplus.com';
        break;
    case dev:
        service.commonService = 'https://development.wang-guanjia.com';
        service.oauthUrl = "https://development.wang-guanjia.com/oauth-server";
        service.resourceService = "https://development.wang-guanjia.com";
        service.uploadUrl = 'https://test.wang-guanjia.com/resource/upload';//测试服务器上传地址
        service.uploadReturnUrl = 'https://test.wang-guanjia.com/static/img/';//测试服务器地址
        service.staticUrl = 'https://test.wang-guanjia.com/resource';
        service.downUrl='https://test.wang-guanjia.com';
        service.appBackground = "https://development.wang-guanjia.com/app-background";
        break;
}

export {config,service}
