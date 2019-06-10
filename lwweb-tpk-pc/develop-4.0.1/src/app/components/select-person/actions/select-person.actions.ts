import { Action } from '@ngrx/store';

export enum selectPersonTypes {
    Set_Search_Data = 'Set_Search_Data',
    Search_Garden_District = 'Search_Garden_District',
    Get_Address_Position_Data = 'Get_Address_Position_Data',
    Load_Address_Success = 'Load_Address_Success',
    Load_Address_Fail = 'Load_Address_Fail',
    Set_Select_Data = 'Set_Select_Data',
    Set_Select_Garden_data = 'Set_Select_Garden_data',
    Set_Tree_Data = 'Set_Tree_Data',
    Set_Select_Person_Data = 'Set_Select_Person_Data',
    Add_Select_Person_Data = 'Add_Select_Person_Data',
    Delete_Select_Person_Data = 'Delete_Select_Person_Data',
    Reset_Select_Person_Data = 'Reset_Select_Person_Data',
    Set_Garden_Length = 'Set_Garden_Length',
    Set_Disable_Persons = 'Set_Disable_Persons'
}
// 设置查询数据
export class setSearchData implements Action {
    readonly type = selectPersonTypes.Set_Search_Data;
    constructor(public payload?: any) { }
}
// 查询数据 待定使用
export class searchGardenDistrict implements Action {
    readonly type = selectPersonTypes.Search_Garden_District;
}
// 查询数据 待定使用
export class getAddressPositionData implements Action {
    readonly type = selectPersonTypes.Get_Address_Position_Data;
}
// 数据成功回调 待定使用
export class loadAddressSuccess implements Action {
    readonly type = selectPersonTypes.Load_Address_Success;
    constructor(public payload: any) {}
}
// 数据失败回调 待定使用
export class loadAddressFail implements Action {
    readonly type = selectPersonTypes.Load_Address_Fail;
    constructor(public payload: any) {}
}

// 设置下拉数据
export class setSelectData implements Action {
    readonly type = selectPersonTypes.Set_Select_Data;
    constructor(public payload: any) {}
}

// 设置选中园区数据
export class setSelectGarden implements Action {
    readonly type = selectPersonTypes.Set_Select_Garden_data;
    constructor(public payload: any) {}
}
// 设置树数据
export class setTreeData implements Action {
    readonly type = selectPersonTypes.Set_Tree_Data;
    constructor(public payload: any) {}
}
// 设置已选人数据
export class setSelectPersonData implements Action {
    readonly type = selectPersonTypes.Set_Select_Person_Data;
    constructor(public payload: any) {}
}
// 增加选人数据
export class AddSelectPersonData implements Action {
    readonly type = selectPersonTypes.Add_Select_Person_Data;
    constructor(public payload: any) {}
}
// 删除已选人数据
export class DeleteSelectPersonData implements Action {
    readonly type = selectPersonTypes.Delete_Select_Person_Data;
    constructor(public payload: any) {}
}
// 重置选人数据
export class ResetSelectPersonData implements Action {
    readonly type = selectPersonTypes.Reset_Select_Person_Data;
}

// 设置园区数量
export class setGardenLength implements Action {
    readonly type = selectPersonTypes.Set_Garden_Length;
    constructor(public payload: any) {}
}
// 设置禁用人员
export class setDisablePersons implements Action {
    readonly type = selectPersonTypes.Set_Disable_Persons;
    constructor(public payload: any) {}
}
export type Actions = 
    |setSearchData
    |searchGardenDistrict
    |getAddressPositionData
    |loadAddressSuccess
    |setSelectData
    |setSelectGarden
    |setTreeData
    |setSelectPersonData
    |AddSelectPersonData
    |DeleteSelectPersonData
    |ResetSelectPersonData
    |setGardenLength
    |setDisablePersons
    |loadAddressFail;