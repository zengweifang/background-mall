let config = {
    pvResponse: 100,
    successCode: 200,
    redirect: 300,
    clientError: 400,
    serviceError: 500,
    paramsError: 600,
    domain: "",
    clientId: "",
    clientSecret: ""
}

let service = {
    commonService: '',
    oauthUrl: '',
}

let currentUrl = location.hostname;
let localhost = "localhost";
let test = "test.zunxiangviplus.com";
let product = "app.zunxiangviplus.com";
switch (currentUrl) {
    case localhost:
        service.commonService = 'https://test.zunxiangviplus.com';
        break;
    case test:
        service.commonService = 'https://test.zunxiangviplus.com';
        break;
    case product:
        service.commonService = 'https://app.zunxiangviplus.com';
        break;
}

export { config, service }
