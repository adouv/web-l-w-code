export interface OutlineParams {
	gradeCode: string;
	subjectCode: string;
	semesterCode: string;
	resource: string;
	classId?: string;
	gradeId?: string;
	gardenId?: string;
	title?: string;
}


export interface ExerciseListParams {
	outlineId: string;
	gardenId: string;
	typeCode?: string;
	designCode?: string;
	offset: string;
	size: string;
}

export interface QuestionListParams {
	selectMode: string | number;
	subjectCode: string;
	gradeCode: string;
	pointIds: any;
	outlineIds: any;
	typeCode: string;
	level: string;
	keyword: string;
	offset: string | number;
	size: string | number;
}