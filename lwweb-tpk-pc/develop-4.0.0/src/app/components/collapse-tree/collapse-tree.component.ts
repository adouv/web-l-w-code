import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {CollapseTreeService, SubjectTree, TreeAction} from './collapse-tree.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Subscription} from 'rxjs/Subscription';

@Component({
	selector: 'collapse-tree',
	templateUrl: 'collapse-tree.component.html',
	styleUrls: ['collapse-tree.component.scss']
})

export class CollapseTreeComponent implements OnChanges, OnDestroy {


	@Input() data = [];


	@Output() change = new EventEmitter();

	@Input() single = false;

	selectNodes: any[] = [];

	@Input() clickId = '';

	@Input() type: string;

	nodeSubscribe: Subscription;

	selectedNode$: SubjectTree;

	constructor(private collapseTreeService: CollapseTreeService,
				private messageService: NzMessageService) {
		setTimeout(() => {
			this.getDefaultChecked();
		}, 0);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.checkbox &&
			changes.checkbox.currentValue !== changes.checkbox.previousValue) {
			this.change.emit([]);
		}
		if (this.type && !this.selectedNode$) {
			this.selectedNode$ = this.collapseTreeService.getSubject(this.type);
			this.onChangeSubject();
		}
	}

	onChangeSubject() {
		this.nodeSubscribe = this.selectedNode$.change().subscribe(data => {
			this.selectNodes = data;
		});
	}

	onNodeSelect(event, item) {
		const ele = event.target.parentElement.parentElement;
		let condition;

		if (this.type === 'outline_tree') {
			item.status = ele.getAttribute('aria-expanded') === 'true';
			condition = item.status;
		} else {
			item.isOpen = ele.getAttribute('aria-expanded') === 'true';
			condition = item.isOpen;
		}
		if (!item.children || condition) {
			this.stopPropagation();
			if (item.isSelect) {
				if (this.single) {
					this.onMultiSelect(event, item);
				} else {
					this.onSingleSelect(event, item);
				}
			}
		}
	}

	onSingleSelect(event, item) {
		if (item) {
			this.selectedNode$.action({type: TreeAction.SINGLE, item: item});
		}
	}

	onMultiSelect(event, item) {
		this.stopPropagation();
		const hasSelect = this.selectNodes.includes(item);
		if (hasSelect || this.selectNodes.length < 4) {
			this.selectedNode$.action({type: TreeAction.MULTI, item: item});
		} else {
			this.messageService.warning('最多可选4个知识点！');
		}
	}

	mergeNodes(event) {
		if (this.single) {
			const arr = [];
			this.selectNodes.forEach(node => {
				if (event.indexOf(node) < 0) {
					arr.push(node);
				}
			});
			this.selectNodes.push(...arr);
			this.change.emit(this.selectNodes);
		} else {
			this.selectNodes = [event];
			this.change.emit(event);
		}
	}

	/**
	 * 阻止默认行为
	 */
	private stopPropagation() {
		window.event ? window.event.cancelBubble = true : event.stopPropagation();
	}

	/**
	 * 匹配默认选中
	 */
	private getDefaultChecked() {
		if (this.data) {
			for (let i = 0; i < this.data.length; i++) {
				if (this.data[i].id === this.clickId) {
					this.selectNodes = [this.data[i]];
					this.selectedNode$.action({type: TreeAction.ASSIGN, item: this.selectNodes});
				}
			}
		}
	}

	ngOnDestroy(): void {
		this.nodeSubscribe.unsubscribe();
	}
}
