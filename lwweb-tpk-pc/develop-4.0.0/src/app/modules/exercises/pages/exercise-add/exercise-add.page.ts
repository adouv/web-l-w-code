import {Component, ViewChild, ElementRef} from '@angular/core';
import {UEditorComponent} from 'lw-ngx-ueditor';
import {DialogService} from '../../../../services/dialog/dialog.service';
import {SelectChapterComponent} from '../../components/select-chapter/select-chapter';
import {ExercisesInterface} from '../../../../services/exercises/exercises.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../../../services/account';
import {NzModalSubject} from 'ng-zorro-antd';
import {OrganizationInterface} from '../../../../services/organization/organization.interface';
import {CollapseTreeService, SubjectTree, TreeAction} from '../../../../components/collapse-tree/collapse-tree.service';

@Component({
	templateUrl: './exercise-add.page.html',
	styleUrls: ['./exercise-add.page.scss']
})

export class ExerciseAddPage {
	exerciseTypes: Array<any>;
	exerciseTypeCheck: any;
	oldExerciseTypeCheck: any;
	editContent: any;
	gradeCode: any;
	semesterCode: any;
	subjectCode: any;
	outlineId: any;
	ueditorConfig: any;
	@ViewChild('editfull') editfull: UEditorComponent;
	@ViewChild('editAnalysi') editAnalysi: UEditorComponent;
	@ViewChild('autoScroll') autoScroll: ElementRef;
	answerAry: Array<any>;
	knowledgeList: Array<any>;
	outlineList: Array<any>;
	knowledgeOpenList: Array<any>;
	outlineOpenList: Array<any>;
	editAnalysis: any;
	editContentStatus: boolean;
	selectStatus: boolean;
	answerContent: any;// 后台传入数据
	isAddOther: boolean;
	isLoadSuccess: boolean;
	gradeList = [];
	subjectList = [];
	editionList = [];
	selectParams: { gradeCode?: string; subjectCode?: string; semesterCode?: string, title?: string; gradeId?: string, classId?: string } = {};
	optionDisable: boolean;
	tabIndex: number;
	single: boolean;
	outlineNames: string;
	selectedNode1$: SubjectTree;
	selectedNode0$: SubjectTree;
	typeCode: any;
	lessonId: any;
	lessonStage: any;
	lessonDate: any;
	classId: any;
	gradeId: any;
	selectedGarden: any;
	selectedYear: any;
	selectedSemester: any;
	selectedWeek: any;
	constructor(private collapseTreeService: CollapseTreeService, private organizationInterface: OrganizationInterface, private subject: NzModalSubject, private router: Router, private accountService: AccountService, private dialogService: DialogService, private exercisesInterface: ExercisesInterface, private activatedRoute: ActivatedRoute) {
		this.exerciseTypes = [];
		this.knowledgeList = [];
		this.outlineList = [];
		this.editContentStatus = false;
		this.isLoadSuccess = false;
		this.selectStatus = false;
		this.isAddOther = false;
		this.optionDisable = true;
		this.initParams();
		this.getTypeList();
		this.getGradeList();
		if (this.tabIndex == 1) {
			// 章节
			this.selectedNode1$ = this.collapseTreeService.getSubject('knowledge_tree');
			this.knowledgeList = this.selectedNode1$.cacheData;
		} else {
			// 知识点
			this.selectedNode0$ = this.collapseTreeService.getSubject('outline_tree');
			this.outlineList = this.selectedNode0$.cacheData;
		}
		this.ueditorConfig = {
			initialFrameHeight: 382,
			initialFrameWidth: null,
			autoFloatEnabled: false
		};
	}

	// 类型改变
	exerciseTypeChange() {
		console.log(this.editfull);
		if (this.exerciseTypeCheck && this.oldExerciseTypeCheck !== this.exerciseTypeCheck) {
			if (!this.judgeAnwer(this.oldExerciseTypeCheck.selectType, false)) {
				this.dialogService.openConfirm({
					title: '是否切换题型',
					content: '切换题型会导致部分字段内容清空，请做好内容备份！',
					mask: false,
					maskClosable: false,
					zIndex: 1003,
					okText: '确定',
					class: 'evaluation-confirm',
					cancelText: '取消',
					wrapClassName: 'vertical-center-modal',
					onCancel: () => {
						this.exerciseTypeCheck = this.oldExerciseTypeCheck;
					},
					onOk: () => {
						this.subject.destroy('onCancel');
						this.oldExerciseTypeCheck = this.exerciseTypeCheck;
						this.exerciseTypeCheck.selectType = parseInt(this.exerciseTypeCheck.selectType) == 6 ? 4 : this.exerciseTypeCheck.selectType;
						this.answerAry = [];
						this.answerAry = [
							{
								type: this.exerciseTypeCheck.selectType, // 1 : 单选。 2： 多选。 3：判断。 4：一问一答， 6 组合题。 5：一问多单选 7一题多多选
								data: {},
								id: 1
							}
						];

					}
				});
			} else {
				this.oldExerciseTypeCheck = this.exerciseTypeCheck;
				this.exerciseTypeCheck.selectType = parseInt(this.exerciseTypeCheck.selectType) == 6 ? 4 : this.exerciseTypeCheck.selectType;
				this.answerAry = [];
				this.answerAry = [
					{
						type: this.exerciseTypeCheck.selectType, // 1 : 单选。 2： 多选。 3：判断。 4：一问一答， 6 组合题。 5：一问多单选 7一题多多选
						data: {},
						id: 1
					}
				];
			}
		}
	}

	// 根据题型判断是否有输入
	judgeAnwer(type, status) {
		this.answerContent = '';
		let result = false;
		// 1 : 单选。 2： 多选。 3：判断。 4：一问一答  7一题多多5：一问多单选选
		switch (parseInt(type)) {
			case 1:
				if (this.answerAry[0].checked == '' || this.answerAry[0].checked == null) {
					result = true;
					if (status) {
						this.answerAry[0].errStatus = true;
					}
				} else {
					this.answerContent = this.answerAry[0].checked;
				}
				break;
			case 2:
				for (let i = 0; i < this.answerAry.length; i++) {
					this.answerContent = '';
					for (let j = 0; j < this.answerAry[i].data.length; j++) {
						if (this.answerAry[i].data[j].checked) {
							this.answerContent += this.answerAry[i].data[j].value;
						}
					}
					if (this.answerContent == '') {
						if (status) {
							this.answerAry[i].errStatus = true;
						}
						result = true;
					}
				}

				break;
			case 3:
				if (this.answerAry[0].checked == '' || this.answerAry[0].checked == null) {
					result = true;
					if (status) {
						this.answerAry[0].errStatus = true;
					}
				} else {
					this.answerContent = this.answerAry[0].checked;
				}
				break;
			case 4:
				if (this.answerAry[0].data == '' || this.answerAry[0].data == null) {
					if (status) {
						this.answerAry[0].errStatus = true;
					}
					result = true;
				} else {
					this.answerContent = this.answerAry[0].data;
				}
				break;
			case 5:
				let index = this.answerAry[0].data.length - 1; // 存储下标， 在中间有未输入时或者长度小于5的记录下标
				for (let i = 0; i < this.answerAry[0].data.length; i++) {
					if (this.answerAry[0].data[i].model != '') { // 当前输入不是空时
						if (this.answerAry[0].data[i].model.length < 5) { // 输入长度小于5
							if (index > i) { // 判断是否第一次小于5 当index>i时 说明是第一次小于5
								index = i;
								this.answerContent += this.answerAry[0].data[i].model;
							} else if (index == i) { // 第一次小于5时
								this.answerContent += this.answerAry[0].data[i].model;
							} else { // 输入长度小于五 并且之前有小于5或者为空的，直接提示错误
								if (status) {
									this.answerAry[0].data[index].errStatus = true;
								}
								result = true;
							}
						} else if (index >= i) { // 说明 数据 == 5 直接加入答案
							this.answerContent += this.answerAry[0].data[i].model.substring(0, 5);

						} else { // 输入长度小于五 并且之前有小于5或者为空的，直接提示错误
							if (status) {
								this.answerAry[0].data[index].errStatus = true;
							}
							result = true;
						}

					} else { // 为空时
						if (index > i) { // 当index>i时 说明时第一次为空
							index = i;
							this.answerContent += this.answerAry[0].data[i].model;
						} else if (i == index || (this.answerAry[0].data.length - 1) == i) {// 当index==i 或者 (this.answerAry[0].data.length - 1) == i 则时第一次或者最后一次为空
							this.answerContent += this.answerAry[0].data[i].model;
						} else { // 输入长度小于五 并且之前有小于5或者为空的，直接提示错误
							if (status) {
								this.answerAry[0].data[index].errStatus = true;
							}

							result = true;
						}
					}
				}
				if (this.answerContent == '' && index == this.answerAry[0].data.length - 1) {
					for (let i = 0; i < this.answerAry[0].data.length; i++) {
						if (status) {
							this.answerAry[0].data[i].errStatus = true;
						}

					}
					result = true;
				} else {
					this.answerContent = this.answerContent.toUpperCase();
				}
				break;
			case 7:
				this.answerContent = [];
				for (let i = 0; i < this.answerAry.length; i++) {
					let answerstring = '';
					for (let j = 0; j < this.answerAry[i].data.length; j++) {
						if (this.answerAry[i].data[j].checked) {
							answerstring += this.answerAry[i].data[j].value;
						}
					}
					if (answerstring == '') {
						if (status) {
							this.answerAry[i].errStatus = true;
						}

						result = true;
					} else {
						this.answerContent.push(answerstring);
					}
				}
				this.answerContent = this.answerContent.join(',');
				break;

		}
		return result;
	}

	initParams() {
		this.activatedRoute.queryParams.subscribe(params => {
			this.gradeCode = params.gradeCode;
			this.subjectCode = params.subjectCode;
			this.semesterCode = params.semesterCode;
			this.outlineId = params.outlineId;
			this.tabIndex = parseInt(params.tabIndex);
			this.typeCode = params.typeCode;
			this.gradeId = params.gradeId;
			this.classId = params.classId;
			this.lessonId = params.lessonId;
			this.lessonDate = params.lessonDate;
			this.lessonStage = params.lessonStage;
			this.selectParams.gradeCode = this.gradeCode;
			this.selectParams.semesterCode = this.semesterCode;
			this.selectParams.subjectCode = this.subjectCode;

			this.selectParams.gradeId = this.gradeId;
			this.selectParams.classId = this.classId;
			this.selectedGarden = params.selectedGarden;
			this.selectedYear = params.selectedYear;
			this.selectedSemester = params.selectedSemester;
			this.selectedWeek = params.selectedWeek;
		});
	}

	// 弹出框
	selectChapter(type) {
		console.log(this.gradeId, this.classId);
		this.dialogService.openDialog({
			title: type == 0 ? '请选择知识点' : '请选择章节',
			content: SelectChapterComponent,
			class: 'select-chaper',
			footer: false,
			maskClosable: false,
			onCancel: () => {
				console.log('onCancel');
			},
			onOk: () => {

			},
			componentParams: {
				gradeCode: this.selectParams.gradeCode,
				subjectCode: this.selectParams.subjectCode,
				semesterCode: this.selectParams.semesterCode,
				gradeId: this.gradeId,
				classId: this.classId,
				type: type,
				checkList: type == 0 ? this.knowledgeList : this.outlineList,
				openNodeList: type == 0 ? this.knowledgeOpenList : this.outlineOpenList,
			}
		});
		this.dialogService.getModal().subscribe(result => {
			if (result.type == 0) {
				this.knowledgeList = result.data.checkAry;
				this.knowledgeOpenList = result.data.openList;
				if (this.knowledgeList.length !== 0 || this.outlineList.length != 0) {
					this.selectStatus = false;
				}
			} else if (result.type == 1) {
				this.outlineList = result.data.checkAry;
				this.outlineOpenList = result.data.openList;
				if (this.knowledgeList.length !== 0 || this.outlineList.length != 0) {
					this.selectStatus = false;
				}
			}
		});
	}

	// 获得题目类型
	getTypeList(callback?: Function) {
		this.exercisesInterface.gettypeList({
			gradeCode: this.gradeCode,
			subjectCode: this.subjectCode
		}).subscribe((data) => {
			this.exerciseTypes = data;
			if (data == null) data = [];
			this.exerciseTypeCheck = data[0];
			this.oldExerciseTypeCheck = data[0];
			this.exerciseTypeCheck.selectType = parseInt(this.exerciseTypeCheck.selectType) == 6 ? 4 : this.exerciseTypeCheck.selectType;
			data.map((value, index) => {
				if (value.code == this.typeCode) {
					this.exerciseTypeCheck = value;
					this.oldExerciseTypeCheck = value;
					this.exerciseTypeCheck.selectType = parseInt(this.exerciseTypeCheck.selectType) == 6 ? 4 : this.exerciseTypeCheck.selectType;
				}
			});
			console.log(this.exerciseTypeCheck);
			if (callback) {
				callback();
			}
			// this.exerciseTypeCheck.selectType = 7;
			this.answerAry = [];
			this.answerAry = [
				{
					type: this.exerciseTypeCheck.selectType, // 1 : 单选。 2： 多选。 3：判断。 4：一问一答， 6 组合题。 5：一问多单选 7一题多多选
					data: null,
					errStatus: false,
					id: 1
				}
			];
		});
	}

	// 添加答案
	addAnswer(index) {
		if (true) {
			this.answerAry.splice(index + 1, 0, {
				type: this.exerciseTypeCheck.selectType,  // 1 : 单选。 2： 多选。 3：判断。 4：一问一答， 6 组合题。 5：一问多单选 7一题多多选
				data: null,
				id: this.answerAry.length + 1
			});
		}
	}

	removeAnswer(d) {
		this.dialogService.openConfirm({
			title: '是否确定删除该答案',
			content: '是否确定删除该答案？ 删除后将不可找回，你还要继续吗？',
			mask: false,
			maskClosable: false,
			zIndex: 1003,
			okText: '确认',
			class: 'evaluation-confirm',
			cancelText: '取消',
			wrapClassName: 'vertical-center-modal',
			onCancel: () => {
				this.subject.destroy('onCancel');
			},
			onOk: () => {
				let newAry = [];
				for (let i = 0; i < this.answerAry.length; i++) {
					if (this.answerAry[i].id != d.id) {
						newAry.push(this.answerAry[i]);
					}
				}
				this.answerAry = newAry;
			}
		});
	}

	// 删除知识点
	removeknowledge(k) {
		this.knowledgeList = this.deleteLi(k, this.knowledgeList);
	}

	// 删除章节
	removeoutline(k) {
		this.outlineList = this.deleteLi(k, this.outlineList);
	}

	deleteLi(td, ary) {
		let newAry = [];
		for (let i = 0; i < ary.length; i++) {
			if (ary[i].id != td.id) {
				newAry.push(ary[i]);
			}
		}
		return newAry;
	}

	addQuestion() {
		if (this.validateData(true)) {
			this.dialogService.alertWarning('有必填项未填，不能发布！');
			return;
		}
		let knowledgeIds = [];
		let outlineIds = [];
		this.knowledgeList.map((value, index, arr) => {
			knowledgeIds.push(value.id);
		});
		this.outlineList.map((value, index, arr) => {
			outlineIds.push(value.id);
		});
		if (this.editfull && this.editContent != this.editfull.Instance.getContent()) {
			this.editContent = this.editfull.Instance.getContent();
		}
		if (this.editAnalysi && this.editAnalysis != this.editAnalysi.Instance.getContent()) {
			this.editAnalysis = this.editAnalysi.Instance.getContent();
		}
		this.exercisesInterface.addQuestion({
			gradeCode: this.gradeCode,
			subjectCode: this.subjectCode,
			typeCode: this.exerciseTypeCheck.code,
			knowledgeIds: knowledgeIds.join(','),
			outlineIds: outlineIds.join(','),
			gardenId: this.accountService.getCurrentGardenId(),
			content: this.editContent,
			answer: this.answerContent,
			analysis: this.editAnalysis,
			comment: '',
		}).subscribe((data) => {
			this.dialogService.alertSuccess('发布成功！');
			this.isLoadSuccess = true;
			if (this.isAddOther) {
				// 清空数据
				this.autoScroll.nativeElement.scrollTop = 0;
				this.answerAry = [];
				this.answerAry = [
					{
						type: this.exerciseTypeCheck.selectType, // 1 : 单选。 2： 多选。 3：判断。 4：一问一答， 6 组合题。 5：一问多单选 7一题多多选
						data: null,
						errStatus: false,
						id: 1
					}
				];
				this.editContent = '';
				this.editAnalysis = '';
			} else {
				this.router.navigate(['/exercises/library'], {
					queryParams: {
						gradeCode: this.gradeCode,
						subjectCode: this.subjectCode,
						semesterCode: this.semesterCode,
						gradeId: this.gradeId,
						classId: this.classId,
						lessonId: this.lessonId,
						lessonDate: this.lessonDate,
						lessonStage: this.lessonStage,
						tabIndex: this.tabIndex,
						selectedGarden: this.selectedGarden,
						selectedYear: this.selectedYear,
						selectedSemester: this.selectedSemester,
						selectedWeek: this.selectedWeek,
						selectedClass: this.classId	
					}
				});
			}
		});

	}

	goLibrary() {
		let result = false;
		if (this.knowledgeList.length != 0 || this.outlineList.length != 0) {
			result = true;
		}
		if (!(this.editContent == '' || this.editContent == null)) {
			result = true;
		}
		if (result || !this.judgeAnwer(this.exerciseTypeCheck.selectType, false)) {
			this.dialogService.openConfirm({
				title: '是否关闭',
				content: '已填写信息将会丢失,确认是否关闭?',
				mask: false,
				maskClosable: false,
				zIndex: 1003,
				okText: '是',
				class: 'evaluation-confirm',
				cancelText: '否',
				wrapClassName: 'vertical-center-modal',
				onCancel: () => {
					this.subject.destroy('onCancel');
				},
				onOk: () => {
					this.router.navigate(['/exercises/library'], {
						queryParams: {
							gradeCode: this.gradeCode,
							subjectCode: this.subjectCode,
							semesterCode: this.semesterCode,
							gradeId: this.gradeId,
							classId: this.classId,
							lessonId: this.lessonId,
							lessonDate: this.lessonDate,
							lessonStage: this.lessonStage,
							tabIndex: this.tabIndex,
							selectedGarden: this.selectedGarden,
							selectedYear: this.selectedYear,
							selectedSemester: this.selectedSemester,
							selectedWeek: this.selectedWeek,
							selectedClass: this.classId
						}
					});
				}
			});
		} else {
			this.router.navigate(['/exercises/library'], {
				queryParams: {
					gradeCode: this.gradeCode,
					subjectCode: this.subjectCode,
					semesterCode: this.semesterCode,
					gradeId: this.gradeId,
					classId: this.classId,
					lessonId: this.lessonId,
					lessonDate: this.lessonDate,
					lessonStage: this.lessonStage,
					tabIndex: this.tabIndex,
					selectedGarden: this.selectedGarden,
					selectedYear: this.selectedYear,
					selectedSemester: this.selectedSemester,
					selectedWeek: this.selectedWeek,
					selectedClass: this.classId
				}
			});
		}
	}

	editContentChange() {
		if (this.editContent == '' && !this.isLoadSuccess) {
			this.editContentStatus = true;
		} else {
			this.editContentStatus = false;
			this.isLoadSuccess = false;
		}
	}

	validateData(status): boolean {
		this.answerContent = '';
		let result = false;
		// 验证知识点
		if (this.knowledgeList.length == 0 && this.outlineList.length == 0) {
			this.selectStatus = true;
			result = true;
		}
		if (this.editContent == '' || this.editContent == null) {
			this.editContentStatus = true;
			result = true;
		}
		if (this.judgeAnwer(this.exerciseTypeCheck.selectType, status)) {
			result = true;
		}
		return result;
	}

	/*------------------------------------------------年级和学科选择------------------------------------------------*/
	changeGrade(event, key) {
		if (!event && this.gradeCode !== key) {
			this.selectParams.gradeCode = key;
			this.selectParams.subjectCode = null;
			this.selectParams.semesterCode = null;
			const code = this.gradeList.find(item => item.gradeCode === key).id;
			this.getSubjectListByGradeId(code);
			// this.change.emit({
			// 	outlineParams: [],
			// 	selectParams: this.selectParams
			// });
		}
	}

	changeSubject(event, key) {
		if (!event && this.subjectCode !== key) {
			this.selectParams.semesterCode = null;
			// this.getEditionList(this.selectParams.gradeCode, key);
			// this.change.emit({
			// 	outlineParams: [],
			// 	selectParams: this.selectParams
			// });
		}
	}

	getGradeList() {
		this.organizationInterface.getGradeList(this.accountService.getAccountId(), this.accountService.getCurrentGardenId()).subscribe(data => {
			this.gradeList = data;
			// TODO 修改
			this.selectParams.gradeCode = this.selectParams.gradeCode || data[0].gradeCode;
			for (const grade of data) {
				if (grade.gradeCode === this.selectParams.gradeCode) {
					this.getSubjectListByGradeId(grade.id);
				}
			}
		});
	}

	getSubjectListByGradeId(gradeId) {
		this.organizationInterface.getSubjectListByGradeId(this.accountService.getCurrentGardenId(),
			gradeId, this.selectParams.classId).subscribe(data => {
			this.subjectList = data;
			this.selectParams.subjectCode = this.selectParams.subjectCode || (data[0] ? data[0].id : '');
		});
	}
}