import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { ResourceInfoPage } from './pages/resource-info/resource-info.page';
import { Observable } from 'rxjs/Observable';
export class ResourceInfoDeactivate implements CanDeactivate<ResourceInfoPage> {
	canDeactivate(component: ResourceInfoPage, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

		if (!component.videoId) {
			return true;
		}

		return confirm('视频正在录制中，切换到其他界面，将会停止录制。是否确定切换？');
	}

}
