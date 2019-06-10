/**
 * 用于自定义下拉菜单(dropdownbar)的数据模型
 */
// 选中
export const SELECTED = 1;
// 未选中
export const UNSELECTED = 0;

export class SelectDataItem {
    private _code: string;
    private _name: string;
    private _state: number;
    // 列表的具体数据
    private _data: any;

    constructor(code?: string, name?: string, state?: number, data?: string) {
        if (code) {
            this.code = code;
        }
        if (name) {
            this._name = name;
        }
        if (state) {
            this._state = state;
        }
        if (data) {
            this._data = data;
        }
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get state(): number {
        return this._state;
    }

    set state(value: number) {
        this._state = value;
    }

    get data(): any {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }
}
