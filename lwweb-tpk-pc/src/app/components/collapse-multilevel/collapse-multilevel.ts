import {Component, Input, OnInit, OnChanges, ViewChild, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {ResourceHomeInterface} from '../../services/resource/resource-home.interface';

@Component({
	selector: 'collapse-multilevel',
	templateUrl: './collapse-multilevel.html',
	styleUrls: ['./collapse-multilevel.scss']
})

export class CollapseMultilevelComponent implements OnInit {
	@Input() data: any;
	@Input() clickId: any;
	@Input() subjectCode: any;
	@Input() isCurrent: boolean;
	@Input() config: any;
	@Output() nodeClick: EventEmitter<any> = new EventEmitter();

	@Input() resource: any;

	constructor(private router: Router, private resourceHomeInterface: ResourceHomeInterface) {
	}

	ngOnInit() {
		if (!this.config) {
			this.config = {
				manager: true,
				prepare: true,
				exercises: true,
			};
		}
	}

	/**
	 * 进入课件详情
	 * @param data
	 */
	goInfo(data, $event, status) {
		let isOpen = 'true';
		if (!status) {
			if (data.childOutlineList === null || data.childOutlineList.length === 0) {
				this.stopPropagation();
				this.setOutlineIdsCache(this.getCache(data), () => {
					this.nodeClick.emit({
						type: -1,
						typeMsg: 'rowClick----点击行',
						data: {
							subjectCode: this.subjectCode,
							title: data.title,
							id: data.id
						}
					});
					// this.router.navigate(['resource/info', data.id], {
					// 	queryParams: {
					// 		subjectCode: this.subjectCode,
					// 		title: data.title
					// 	}
					// });
				});
			} else {
				if (document.getElementById('collapse' + data.id)) {
					isOpen = document.getElementById('collapse' + data.id).querySelector('.ant-collapse-header').getAttribute('aria-expanded');
				}
				if (isOpen === 'true') {
					this.stopPropagation();
					this.setOutlineIdsCache(this.getCache(data), () => {
						this.nodeClick.emit({
							type: -1,
							typeMsg: 'rowClick----点击行',
							data: {
								subjectCode: this.subjectCode,
								title: data.title,
								id: data.id
							}
						});
						// this.router.navigate(['resource/info', data.id], {
						// 	queryParams: {
						// 		subjectCode: this.subjectCode,
						// 		title: data.title
						// 	}
						// });
					});
				}
			}
		}
	}

	/**
	 * 进入备课
	 * @param data
	 */
	goPrepare(data) {
		this.stopPropagation();
		this.setOutlineIdsCache(this.getCache(data), () => {
			this.nodeClick.emit({
				type: 0,
				typeMsg: 'prepareClick----点击备课',
				data: {
					subjectCode: this.subjectCode,
					title: data.title,
					id: data.id
				}
			});
			// this.router.navigate(['resource/prepare', data.id], {
			// 	queryParams: {
			// 		title: data.title
			// 	}
			// });
		});

	}

	/**
	 * 进入精品课
	 * @param data
	 */
	goManager(data) {
		this.stopPropagation();
		this.setOutlineIdsCache(this.getCache(data), () => {
			this.nodeClick.emit({
				type: 1,
				typeMsg: 'managerClick----点击精品课',
				data: {
					subjectCode: this.subjectCode,
					title: data.title,
					id: data.id
				}
			});
			// this.router.navigate(['resource/manager', data.id], {
			// 	queryParams: {
			// 		subjectCode: this.subjectCode,
			// 		title: data.title
			// 	}
			// });
		});

	}

	// 进入习题
	goExercises(data) {
		this.stopPropagation();
		this.setOutlineIdsCache(this.getCache(data), () => {
			this.nodeClick.emit({
				type: 2,
				typeMsg: 'exercisesClick----点击习题',
				data: {
					subjectCode: this.subjectCode,
					title: data.title,
					id: data.id
				}
			});
		});
	}

	/**
	 * 阻止默认行为
	 */
	private stopPropagation() {
		window.event ? window.event.cancelBubble = true : event.stopPropagation();
	}

	setOutlineIdsCache(params, callback) {
		this.resourceHomeInterface.setOutlineIdsCache(params).subscribe((res) => {
			callback();
		});
	}


	private getCache(obj): Object {
		const doms = document.querySelectorAll('.ant-collapse-header[aria-expanded=true]');
		const str = [];
		for (let i = 0; i < doms.length; i++) {
			str.push(doms[i].querySelector('.title-box').getAttribute('id'));
		}
		return {
			rootId: obj.rootId,
			outlineIds: str.join(','),
			outlineId: obj.id,
			resource: this.resource
		};
	}
}
