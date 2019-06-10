import {ApplicationRef, enableProdMode, NgModuleRef} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {createNewHosts} from "@angularclass/hmr";

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => {
    return platformBrowserDynamic().bootstrapModule(AppModule);
};

const hmrBootstrap = (module: any, bootstrap: () => Promise<NgModuleRef<any>>) => {
    let ngModule: NgModuleRef<any>;
    module.hot.accept();
    bootstrap().then(mod => {
        ngModule = mod;
    });
    module.hot.dispose(() => {
        let appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
        let elements = appRef.components.map(c => c.location.nativeElement);
        let makeVisible = createNewHosts(elements);
        ngModule.destroy();
        makeVisible();
    });
};

if (environment.hmr) {
    if (module['hot']) {
        hmrBootstrap(module, bootstrap);
    } else {
        console.error('HMR没有启用，确保 ng server 命令加上 --hmr 标记');
    }
} else {
    bootstrap();
}
