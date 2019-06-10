import { Inject, Injectable } from '@angular/core';
import { LwHttpService } from '../common';
import { LW_MODULE_CODE, ModuleCode } from '../common/config';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class WebSiteService {

	constructor(private http: LwHttpService,
		@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}

	getColumn(params: any) {
		return this.http.get(this.moduleCode.WEBSITE_CMS, '/column/all', params);
	}
	getColumnChild(params: any) {
		return this.http.get(this.moduleCode.WEBSITE_CMS, '/column/child', params);
	}

	getArticle(params: any) {
		return this.http.get(this.moduleCode.WEBSITE_CMS, '/article', params, { observe: 'response' }).pipe(map(response => {
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		}));
	}

	// 获取文章详情列表
	getArticleDetail(id?: any) {
		return this.http.get(this.moduleCode.WEBSITE_CMS, `/article/${id}`);
	}

	// 获取招生欢迎页信息
	getWelcomePage(){
		return this.http.get(this.moduleCode.WEBSITE_CMS,'/registerGuide');
	}
	// 获取招生页的父路径
	getWelcomeParentPath(id){
		return this.http.get(this.moduleCode.WEBSITE_CMS, '/column/article', {articleId: id});
	}
	// 获取栏目下的所有文章
	getAllArticle(params:{
		columnName:string
	}){
		return this.http.get(this.moduleCode.WEBSITE_CMS, `/article/all?columnName=${params.columnName}`);
	}
	// 获取banner
	getColumnBanner(id) {
		return this.http.get(this.moduleCode.WEBSITE_CMS, `/column/banner?id=${id}`);
	}
}
