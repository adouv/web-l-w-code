import { Injectable } from '@angular/core';
import {
    CanActivate, //守卫，处理导航到某路由的情况。
    Router,
    ActivatedRouteSnapshot,  //包含了即将被激活的路由。
    RouterStateSnapshot, //包含了该应用即将到达的状态。
    CanActivateChild //守卫，处理导航到子路由的情况
} from '@angular/router';
import { Observable } from "rxjs";
@Injectable()
export class RouterCanActivate implements CanActivate {
    constructor() { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        console.log('router adou');
        return true;
    }
}