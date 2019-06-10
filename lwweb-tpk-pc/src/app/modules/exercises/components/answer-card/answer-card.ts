import {Component, ViewChild, Input, OnInit} from '@angular/core';
import {UEditorComponent} from 'lw-ngx-ueditor';
@Component({
	selector: 'answer-card',
	templateUrl: './answer-card.html',
	styleUrls: ['./answer-card.scss']
})

export class AnswerCardComponent implements OnInit {
	exerciseTypeCheck: any;
	oldExerciseTypeCheck: any;
	checkOptionsOne: Array<any>;
	selectNum: any;
	ueditorDynamicConfig: any;
	selectNumCheck: any;
	exerciseTypes: any;
	oldSelectNumCheck: any;
	@Input() config: any;
	@ViewChild('editfull') editfull: UEditorComponent;

	constructor() {
		// 选项静态数据
		this.checkOptionsOne = [
			{label: 'A', value: 'A', checked: false},
			{label: 'B', value: 'B', checked: false},
			{label: 'C', value: 'C', checked: false},
			{label: 'D', value: 'D', checked: false},
			{label: 'E', value: 'E', checked: false},
			{label: 'F', value: 'F', checked: false},
			{label: 'G', value: 'G', checked: false},
			{label: 'H', value: 'H', checked: false},
			{label: 'I', value: 'I', checked: false},
			{label: 'J', value: 'J', checked: false},
			{label: 'K', value: 'K', checked: false},
			{label: 'L', value: 'L', checked: false},
			{label: 'M', value: 'M', checked: false},
			{label: 'N', value: 'N', checked: false},
			{label: 'O', value: 'O', checked: false},
		];
		this.selectNum = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
		this.selectNumCheck = this.selectNum[2];
		this.ueditorDynamicConfig = {
			initialFrameHeight: 212
		}
		// 1 : 单选。 2： 多选。 3：判断。 4：一问一答， 6 组合题。 5：一问多单选 7一题多多选
		this.exerciseTypes = [{
			type: 1,
			name: '单选题'
		}, {
			type: 2,
			name: '多选题'
		}, {
			type: 3,
			name: '判断题'
		}, {
			type: 4,
			name: '填空题'
		}, {
			type: 4,
			name: '组合题'
		}, {
			type: 4,
			name: '解答题'
		}, {
			type: 4,
			name: '其他'
		}]
	}

	ngOnInit() {
		if (this.config.type == 7) {
			// 一题多多单选
			this.config.data = this.checkOptionsOne.slice(0, this.selectNumCheck);
			this.exerciseTypeCheck = this.exerciseTypes[1];
		} else if (this.config.type == 4) {
			// 组合题
			this.exerciseTypeCheck = this.exerciseTypes[4];
			this.config.data = '';
		} else if (this.config.type <= 2) {
			// 单选和多选
			this.config.data = [];
			this.config.checked = false;
			this.config.data = this.checkOptionsOne.slice(0, this.selectNumCheck);
			this.exerciseTypeCheck = this.exerciseTypes[parseInt(this.config.type) - 1];
		} else if (this.config.type == 3) {
			// 判断题
			this.exerciseTypeCheck = this.exerciseTypes[parseInt(this.config.type) - 1];
		} else if (this.config.type == 5) {
			// 一题多单选
			this.config.data = [{
				title: '1~5',
				model: ''
			}]
		}
	}

	// 改变供选答案类型改变
	selectNumChange() {
		if (this.selectNumCheck && this.oldSelectNumCheck !== this.selectNumCheck) {
			this.oldSelectNumCheck = this.selectNumCheck;
			this.config.checked = false;
			this.config.data = this.checkOptionsOne.slice(0, this.selectNumCheck);
		}
	}

	// 修改子题类型
	exerciseTypeChange() {
		if (this.exerciseTypeCheck && this.oldExerciseTypeCheck !== this.exerciseTypeCheck) {
			this.oldExerciseTypeCheck = this.exerciseTypeCheck;
			this.config.minType = this.exerciseTypeCheck.type;
			if (this.exerciseTypeCheck.type <= 2) {
				this.config.data = [];
				this.config.data = this.checkOptionsOne.slice(0, this.selectNumCheck);
			} else {
				this.config.data = '';
			}
		}
	}

	// 一题多单选， 增加单选
	addType5Answer() {
		this.config.data.push({
			title: (this.config.data.length * 5 + 1) + '~' + (this.config.data.length * 5 + 5),
			model: ''
		});
	}

	// 一题多单选， 删除单选
	removeType5Answer() {
		if (this.config.data.length > 1) {
			this.config.data = this.config.data.slice(0, this.config.data.length - 1);
		}
	}

	// 一题多单选 输入框验证
	handleInput($event, d) {
		// console.log(d.model);
		d.errStatus = false;
		if ($event.target.value == '') {
			return false;
		}
		//小写转大写
		$event.target.value = $event.target.value.toUpperCase();
		//判断是否为英文
		if (!/^([A-Za-z]+\s?)*[A-Za-z]$/.test($event.target.value)) {
			d.model = $event.target.value = $event.target.value.substr(0, $event.target.value.length - 1);
			return $event.target.value = $event.target.value.substr(0, $event.target.value.length - 1);
		}
		//判断是否超过长度
		if ($event.target.value.length > 5) {
			d.model = $event.target.value.substr(0, 5);
			return $event.target.value = $event.target.value.substr(0, 5);
		}
		d.model = $event.target.value.substr(0, 5);
	}

	judgeChange(config) {
		config.errStatus = false;
	}

	ueditorChange(config) {
		setTimeout(()=>{
			if(this.config.data != this.editfull.Instance.getContent()){
				this.config.data = this.editfull.Instance.getContent();
			}
		},500);
		if (config.data == '') {
			config.errStatus = true;
		} else {
			config.errStatus = false;
		}
	}
}