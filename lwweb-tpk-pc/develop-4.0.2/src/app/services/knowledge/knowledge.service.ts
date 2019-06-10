import {Injectable} from '@angular/core';
import {KnowledgeInterface} from './knowledge.interface';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

@Injectable()
export class KnowledgeService {

	constructor(private knowledgeInterface: KnowledgeInterface,
				private router: Router) {
	}

	getKnowledgeList(gradeCode: string, subjectCode: string, name?:string) {
		if (!gradeCode || !subjectCode) {
			return Observable.of([]);
		} else {
			return this.knowledgeInterface.getKnowledgeList(gradeCode, subjectCode, name).map(data => this.treeNode({knowledgePointVos: data}).children);
		}
	}

	private treeNode(item, level = 0): any {
		// 在校本题库中所有节点都可以点选
		const isLibrary = this.router.url.indexOf('exercises/library') > -1;
		if (item.knowledgePointVos && item.knowledgePointVos.length > 0) {
			let isSelect = isLibrary ? level !== 0 : level !== 1;
			const children = item.knowledgePointVos.map(data => {
				if (level === 2 && !isLibrary) {
					if (isSelect && data.knowledgePointVos && data.knowledgePointVos.length > 0) {
						isSelect = false;
					}
				}
				return this.treeNode(data, level + 1);
			});
			return {
				name: item.name,
				id: item.id,
				level,
				isSelect,
				children: children
			};
		} else {
			return {
				name: item.name,
				id: item.id,
				isSelect: true,
				level
			};
		}
	}
}
