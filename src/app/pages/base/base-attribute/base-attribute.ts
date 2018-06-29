//创建数据模型
export class AttributeBase{
    name:string;
    attributeDefineDTOList:AttributeObj[];

    constructor(name:string,attributeDefineDTOList:AttributeObj[]){
        this.name = name;
        this.attributeDefineDTOList = attributeDefineDTOList;
    }
}

export class AttributeObj{
    //定义类型
    required:boolean;
    scope:number;
    title:string;
    attrType:number;
    attributeValueDTOList:AttributeValueDTO[];
    timeScope:number;

    //构造器
    constructor(data : {
        required:boolean,
        scope:number,
        title:string,
        attrType:number,
        attributeValueDTOList:AttributeValueDTO[],
        timeScope:number
    }){
        this.required = data.required;
        this.scope = data.scope;
        this.title = data.title;
        this.attrType = data.attrType;
        this.attributeValueDTOList=data.attributeValueDTOList;
        this.timeScope=data.timeScope;
    }

}

export class AttributeValueDTO{
    content : string;
    textConstraintType:number;
    sort:number;

    constructor(data : {
        content : string,
        textConstraintType : number;
        sort:number;
    }){
        this.content = data.content;
        this.textConstraintType = data.textConstraintType;
        this.sort = data.sort;
    }
}

export class Base{
	attrField:String;
	id:String;
	name:String;
}

