import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LwResponseService } from '../interceptor';
import { LwOauth2Service } from '../oauth2'

@Injectable()
export class routerAuthServices implements CanActivate {
    constructor(
        private router: Router,
        private responseService: LwResponseService,
        private oauth2Service: LwOauth2Service
    ) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        this.responseService.invalidToken().subscribe((data) => {
            //console.log('checkLogin-canActivate');
            // debugger;
            // console.log(data);
            // token失效时退出
            if (data.status === 401) {
                this.oauth2Service.logout();
                this.router.navigate(['login']);
                return false;
            } else {
                return true;
            }
        });
        // if (location.pathname === '/') {
        //     debugger;
        //     this.router.navigate(['resource/home/-1']);
        //     return true;
        // }
        // else {

        // }
        //this.router.navigate(['resource/home/-1']);
        return true;
    }

}