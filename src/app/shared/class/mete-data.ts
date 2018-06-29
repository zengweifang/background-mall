
// 元数据接口
export class MetaData {
    attrTypes : MetaDataKeyType[];
    timeScopes : MetaDataKeyType[];
    scopes : MetaDataKeyType[];
    textConstraintTypes : MetaDataKeyType[];
    status : MetaDataKeyType[];
}

export class MetaDataKeyType {
    id : number;
    name : string;
}
