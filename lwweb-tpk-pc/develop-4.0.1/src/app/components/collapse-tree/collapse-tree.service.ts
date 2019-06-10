import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {auditTime,tap} from 'rxjs/operators';

export const TreeType = {
	KNOWLEDGE_TREE: 'knowledge_tree',
	OUTLINE_TREE: 'outline_tree'
};

export enum TreeAction {
	SINGLE, // 单选添加
	MULTI, // 多选添加
	ASSIGN
}

export class SubjectTree {

	subject = new Subject<any[]>();
	cacheData = [];
	prevCache = [];

	change() {
		return this.subject.asObservable().pipe(auditTime(100));
	}

	action(action: { type: TreeAction, item: any }) {
		if (action.item) {
			switch (action.type) {
				case TreeAction.MULTI:
					const index = this.cacheData.indexOf(action.item);
					if (index < 0) {
						this.cacheData.push(action.item);
					} else {
						this.cacheData.splice(index, 1);
					}
					break;
				case TreeAction.SINGLE:
					this.cacheData = [action.item];
					break;
				case TreeAction.ASSIGN:
					this.cacheData = action.item;
					break;
			}
			if (this.prevCache !== this.cacheData) {
				this.prevCache = Object.create(this.cacheData);
				this.subject.next(this.cacheData);
			}
		}
	}


}


@Injectable()
export class CollapseTreeService {

	private knowledge_tree = new SubjectTree();
	private outline_tree = new SubjectTree();

	getSubject(type: string): SubjectTree {
		return this[type];
	}

}
