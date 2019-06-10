import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

enum HttpMethod {
	GET = 'get',
	POST = 'post',
	PUT = 'put',
	DELETE = 'delete',
}

@Injectable()
export class LwHttpService {
	constructor(private http$: HttpClient) {
	}

	request(method: string, url: string, params: any, options: any = {}): Observable<any> {
		return this.http$.request(method, url, {...options, body: params})
			.do(data => {
				return data;
			})._catch(err => {
				return Observable.throw(err);
			});
	}

	get(moduleId: string, url: string, params?: any, options?: any): Observable<any> {
		return this.http$.get(this.handleUrl(moduleId + url, params), options)
			.do(data => {
				return data;
			})._catch(err => {
				return Observable.throw(err);
			});
	}

	put(moduleId: string, url: string, params?: any, options: any = {}): Observable<any> {
		return this.request(HttpMethod.PUT, moduleId + url, params, options).do(data => {
			return data;
		}).catch(err => {
			return Observable.throw(err);
		});
	}

	delete(moduleId: string, url: string, params?: any): Observable<any> {
		return this.http$.delete(this.handleUrl(moduleId + url, params)).do(data => {
			return data;
		}).catch(err => {
			return Observable.throw(err);
		});
	}

	post(moduleId: string, url: string, params?: any, options?: any): Observable<any> {
		return this.request(HttpMethod.POST, moduleId + url, params).do(data => {
			return data;
		}).catch(err => {
			return Observable.throw(err);
		});
	}

	patch(moduleId: string, url: string, params?: any): Observable<any> {
		return this.http$.patch(moduleId + url, this.getParamsSerializer(params)).do(data => {
			return data;
		}).catch(err => {
			return Observable.throw(err);
		});
	}

	handleUrl(url: string, params: any): string {
		const fromString = this.getParamsSerializer(params);
		return fromString ? url + '?' + fromString : url;
	}

	private getParamsSerializer(params: any = {}): string {
		return (function (data) {
			const paramsSerializer = (param) => {
				let serializeParams = '';
				if (param instanceof Object) {
					for (const name of Object.keys(param)) {
						serializeParams += convertParams(name, param[name]);
					}
				} else {
					throw new Error('请求参数必须是一个对象！');
				}
				return serializeParams.length ? serializeParams.substr(1) : serializeParams;
			};
			const getObjectParam = function (key, subKey, value) {
				let subValue;
				const subParams = {};
				subValue = value[subKey];
				subKey = key + '.' + subKey;
				subParams[subKey] = subValue;
				return '&' + paramsSerializer(subParams);
			};
			const getArrayParam = function (key, index, value) {
				let subKey, subValue;
				const subParams = {};
				subValue = value[index];
				subKey = key + '[' + index + ']';
				subParams[subKey] = subValue;
				return '&' + paramsSerializer(subParams);
			};
			const convertParams = function (key, value) {
				let serializeParams = '';
				if (value instanceof Array) {
					value.forEach((dataItem, i) => {
						serializeParams += getArrayParam(key, i, value);
					});
				} else if (value instanceof Object) {
					for (const subKey of Object.keys(value)) {
						serializeParams += getObjectParam(key, subKey, value);
					}
				} else if (value !== undefined &&
					value !== null && value !== '') {
					serializeParams += '&' + encodeURIComponent(key) +
						'=' + encodeURIComponent(value);
				}
				return serializeParams;
			};
			return paramsSerializer(data);
		})(params);
	}
}
