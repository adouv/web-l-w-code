import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

export class AppRouterStrategy implements RouteReuseStrategy {

	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		return false;
	}

	store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
	}

	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		return false;
	}

	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
		return null;
	}

	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		const isTrue = future.routeConfig === curr.routeConfig;
		if (future.routeConfig && curr.routeConfig) {
			if (isTrue && !future.routeConfig.path.includes('/:')) {
				return false;
			}
		}
		return isTrue;
	}

}
