import {Injectable} from '@angular/core';
import {ExercisesInterface} from './exercises.interface';
import {OutlineParams} from './exercises.model';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

@Injectable()
export class ExercisesService {

	constructor(private exercisesInterface: ExercisesInterface,
				private router: Router) {
	}

	getOutlineList(params: OutlineParams) {
		params.title = params.title?params.title.trim():'';
		if (!params.gradeCode || !params.subjectCode || !params.semesterCode) {
			return Observable.of([]);
		} else {
			return this.exercisesInterface.getOutlineList(params)
				.map(data => this.treeNode({childOutlineList: data}).children).do(data => console.log(data, 'ccccc'));
		}
	}


	private treeNode(item): any {
		// 在校本题库中所有节点都可以点选
		const isLibrary = this.router.url.indexOf('exercises/library') > -1;
		if (item.childOutlineList.length > 0) {
			let isSelect = isLibrary ? item.level > 0 : item.level > 1;
			const children = item.childOutlineList.map(data => {
				if (data.level < 4 && !isLibrary) {
					if (isSelect && data.childOutlineList.length > 0) {
						isSelect = false;
					}
				}
				return this.treeNode(data);
			});
			return {
				isOpen: item.isOpen,
				rootId: item.rootId,
				name: item.title,
				id: item.id,
				level: item.level,
				isSelect,
				children: children,
				canPrepare: item.canPrepare
			};
		} else {
			return {
				isOpen: item.isOpen,
				rootId: item.rootId,
				name: item.title,
				id: item.id,
				isSelect: true,
				level: item.level,
				canPrepare: item.canPrepare
			};
		}
	}
}
