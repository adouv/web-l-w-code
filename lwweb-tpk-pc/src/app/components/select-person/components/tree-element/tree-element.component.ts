import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {SelectPersonService} from '../../services/select-person.service';
import {Observable} from 'rxjs';
import * as fromRoot from '../../reducers';
import * as selectParsonAction from '../../actions/select-person.actions';

@Component({
	selector: 'tree-element',
	templateUrl: './tree-element.component.html',
	styleUrls: ['./tree-element.component.scss']
})
export class TreeElementComponent implements OnInit {
	@Input() data: any;
	@Input() index: any;
	addPersonAry: any;

	constructor(private store: Store<fromRoot.State>, private selectPersonService: SelectPersonService) {
		this.data = {};
		this.data.status = false;
		this.index = 0;
		this.addPersonAry = [];
	}

	ngOnInit() {
		this.index = parseInt(this.index) + 1;
		this.store.select(fromRoot.getSelectPersonState).subscribe((data) => {
			this.data.checked = data.selectPersonData.findIndex((item) => {
				return item.id == this.data.id;
			}) > -1;
		});
		setTimeout(() => {
			if (document.getElementById('checkbox_id_' + this.data.id)) {
				document.getElementById('checkbox_id_' + this.data.id).addEventListener('mousedown', () => {
					if (!this.data.isLeaf && this.data.departmentName == null) {
						this.data.checked = true;
					}
				});
				document.getElementById('checkbox_id_' + this.data.id).addEventListener('mouseup', () => {
					if (!this.data.isLeaf && this.data.departmentName == null) {
						this.data.checked = false;
					}
				});
			}
		}, 500);
	}

	showChildren() {
		this.stopPropagation();
		this.data.status = !this.data.status;
		if (this.data.isLeaf && this.data.departmentName != null) {
			this.data.checked = !this.data.checked;
			if (this.data.checked) {
				this.store.dispatch(new selectParsonAction.AddSelectPersonData([this.data]));
			} else {
				this.store.dispatch(new selectParsonAction.DeleteSelectPersonData(this.data));
			}
		}
	}

	checkMousedown() {
	}

	checkData() {
		this.stopPropagation();
		if (!this.data.isLeaf && this.data.departmentName == null) {
			// 选中所有数据
			this.data.checked = false;
			this.addPersonAry = [];
			if (this.data.children && this.data.children.length > 0) {
				this.selectChildren(this.data);
				this.store.dispatch(new selectParsonAction.AddSelectPersonData(this.addPersonAry));
			}
		} else {
			this.data.checked = !this.data.checked;
			if (this.data.checked) {
				this.store.dispatch(new selectParsonAction.AddSelectPersonData([this.data]));
			} else {
				this.store.dispatch(new selectParsonAction.DeleteSelectPersonData(this.data));
			}
		}
	}

	selectChildren(data) {
		if (data.children && data.children.length > 0) {
			data.children.map((item) => {
				if (item.isLeaf) {
					item.checked = true;
					this.addPersonAry.push(item);
					;
				}
				if (item.children && item.children.length > 0) {
					item.checked = false;
					this.selectChildren(item);
				}
			});
		}
	}

	/**
	 * 阻止默认行为
	 */
	private stopPropagation() {
		window.event ? window.event.cancelBubble = true : event.stopPropagation();
	}

}
