import * as selectPersonActions from '../actions/select-person.actions';
export interface State {
    selectPersonData: Array<any>;
    searchData: any;
    selectData: any;
    addressPositionData: any;
    selectGardenData: any;
    treeData: any;
    gardenLength: any;
    disablePersons: any;
}

const initState: State = {
    selectPersonData: [],// 已选人
    searchData: {},// 查询数据
    selectData: [],//学校类型下拉数据
    addressPositionData: [],// 行政区域
    selectGardenData: {},// 选择园区数据
    treeData: [], // 树数据
    gardenLength:0, //园区数量
    disablePersons: [] // 禁用人员
}

export function reducer(state = initState, action: selectPersonActions.Actions): State {
    switch (action.type) {
        case selectPersonActions.selectPersonTypes.Set_Search_Data:
            if (action.payload != null) {
                state.searchData = Object.assign({}, state.searchData, action.payload);
            }
            return { ...state };
        case selectPersonActions.selectPersonTypes.Load_Address_Success:
            if (action.payload != null) {
                state.addressPositionData = action.payload;
            }
            return { ...state };
        case selectPersonActions.selectPersonTypes.Load_Address_Fail:
            state.addressPositionData = [];
            return { ...state };
        case selectPersonActions.selectPersonTypes.Search_Garden_District:
            return { ...state };
        case selectPersonActions.selectPersonTypes.Set_Select_Data:
            if (action.payload != null) {
                state.selectData = action.payload;
            }
            return { ...state };
        case selectPersonActions.selectPersonTypes.Set_Select_Garden_data:
            if (action.payload != null) {
                state.selectGardenData = action.payload;
            }
            return { ...state };
        case selectPersonActions.selectPersonTypes.Set_Tree_Data:
            if (action.payload != null) {
                state.treeData = action.payload;
            }
            return { ...state };
        case selectPersonActions.selectPersonTypes.Set_Select_Person_Data:
            if (action.payload != null) {
                state.selectPersonData = action.payload;
            }
            return { ...state };
        case selectPersonActions.selectPersonTypes.Add_Select_Person_Data:
            if (action.payload != null) {
                action.payload.map((data) => {
                    if (state.selectPersonData.findIndex((item) => {
                        return item.id == data.id
                    }) < 0) {
                        state.selectPersonData.push(data);
                    }
                })
            }
            return { ...state };
        case selectPersonActions.selectPersonTypes.Delete_Select_Person_Data:
            if (action.payload != null) {
                let result = [];
                state.selectPersonData.map((item) => {
                    if (item.id != action.payload.id) {
                        result.push(item);
                    }
                })
                state.selectPersonData = result;
            }
            return { ...state };
        case selectPersonActions.selectPersonTypes.Reset_Select_Person_Data:
            state.selectPersonData = [];
            return { ...state };
        case selectPersonActions.selectPersonTypes.Set_Garden_Length:
            if (action.payload != null) {
                state.gardenLength = action.payload;
            }
            return { ...state };
        case selectPersonActions.selectPersonTypes.Set_Disable_Persons:
            if (action.payload != null) {
                state.disablePersons = action.payload;
            }
            return { ...state };
        default:
            return state;

    }
}

export const getSelectPersonData = (state: State) => {
    return state.selectPersonData;
};

export const getSearchData = (state: State) => {
    return state.searchData;
}

export const getAddressPositionData = (state: State) => {
    return state.addressPositionData;
}
export const getTreeData = (state: State) => state.treeData;
export const getSelectGardenData = (state: State) => {
    return state.selectGardenData;
};

export const getGardenLength = (state: State) => state.gardenLength;
export const getDisablePersons = (state: State) => state.disablePersons;