export const USER_KEY = 'user';
export const GARDEN_ID = 'gardenId';
export const PERMISSION_CODE = 'permission';
export const ALLGARDENS = 'AllGardens';

export interface AccountModel {
	accountId: string;
	accountName: string;
	displayName: string;
	gardens: GardenModel[];
	imgUrl: string;
	isNeedModifyPassword: boolean;
	signatureImgUrl: string;
}


export interface GardenModel {
	gardenFullName: string;
	gardenId: string;
	gardenLogo: string;
	gardenName: string;
	gardenTypeId: string;
	gardenTypeName: string;
}
