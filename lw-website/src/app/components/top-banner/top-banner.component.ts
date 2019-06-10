
import { Component, Input, OnInit, AfterViewInit, NgZone, AfterViewChecked,Inject,OnChanges,SimpleChanges, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { LwHttpService } from '../../common';
import { fromEvent } from 'rxjs';
import { WebSiteService } from '../../service/website.service';
import { LW_MODULE_CODE, ModuleCode } from '../../common/config';

declare var $: any;
declare var layui: any;
@Component({
    selector: 'top-banner',
    templateUrl: 'top-banner.component.html',
    styleUrls: ['top-banner.component.scss'],
})

export class TopBannerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    @Input() isHome = false;
	@Input() isWave = true;
    @Input() isType = true;
    @Input() type = 0;
    flag: boolean = false;
    currentPic: number = 0;
    apiUrl: string;
    home: boolean = true;
    timer: any;
    @Input() imageSources = [
        { id: 0, url: 'assets/images/banner1.jpg' },
        { id: 1, url: 'assets/images/banner2.jpg' },
        { id: 2, url: 'assets/images/banner3.jpg' },
    ];
   constructor( @Inject(LW_MODULE_CODE) private moduleCode: ModuleCode,private activatedRoute: ActivatedRoute, private router: Router, private http: LwHttpService, private ngZone: NgZone, private web: WebSiteService) {
        this.apiUrl = this.moduleCode.WEBSITE_CMS;
        // this.router.events.subscribe(event => {
        //     if (event instanceof NavigationEnd) {
        //         if (event.url != "/layout/home") {
        //             this.getBanner(event.url.split('/')[3]);
        //             this.home = false;
        //         } else {
        //             this.imageSources = [
        //                 { id: 0, url: 'assets/images/banner1.jpg' },
        //                 { id: 1, url: 'assets/images/banner2.jpg' },
        //                 { id: 2, url: 'assets/images/banner3.jpg' },
        //             ];
        //         }
        //     }
        // });
        
      

    }

    ngOnInit() {
        if(!this.type){
            if (window.location.pathname != "/layout/home") {
                this.getBanner(window.location.pathname.split('/')[3]);
                this.home = false;
            }else{
            //    let items =  window.localStorage.getItem('navBar');
            //    let id = JSON.parse(items)[0].id;
            //     this.getBanner(id);
            //     this.home = true;
    
                this.imageSources = [
                    { id: 0, url: 'assets/images/banner1.jpg' },
                    { id: 1, url: 'assets/images/banner2.jpg' },
                    { id: 2, url: 'assets/images/banner3.jpg' },
                ];
                clearInterval(this.timer);
                this.timer = setInterval(() => {  
                    let id = (this.currentPic + 1) % this.imageSources.length;
                    this.currentPic = id;
                }, this.isType ? 5000 : 3000);
            };
        }
       
      
      
		// 页面监听
		// fromEvent(window,'resize').subscribe((event) => {
		// 	var isWidth = window.innerWidth;
		// 	// document.getElementById('pub_home_Swiper').style.width = (isWidth-10) + 'px';
		// })
    }

    ngOnChanges(changes: SimpleChanges){
        if(changes.type){
            this.currentPic = 0;
            clearInterval(this.timer);
            this.getBanner(this.type - 0);
            this.home = false;
        }
    }

    ngAfterViewInit() {
        
    }
    
    ngOnDestroy(){
        if(this.timer){
            clearInterval(this.timer)
        }
    }
	btnImgChange(id) {
		this.currentPic = id;
	}
    prev() {
        if (this.currentPic == 1) {
            let id = this.imageSources.length;
            this.currentPic = id;
        } else {
            let id = (this.currentPic - 1) % this.imageSources.length;
            this.currentPic = id;
        }
    }

    next() {
        if (this.currentPic == this.imageSources.length) {
            let id = 0;
            this.currentPic = id;
        } else {
            let id = (this.currentPic + 1) % this.imageSources.length;
            this.currentPic = id;
        }
    }
    getBanner(pathname: any): void {
        this.imageSources = [];
        this.web.getColumnBanner(pathname).subscribe(response => {
            response.forEach(element => {
                if(element.url.search('http') == -1) element.url = this.apiUrl +  element.url;
                this.imageSources.push(element);
            });
            if(this.home){
                this.isType = true;
                this.isWave = true;
            }else{
                this.isType = false;
                this.isWave = false;
            }
            this.timer = setInterval(() => {  
               let id = (this.currentPic + 1) % this.imageSources.length;
               this.currentPic = id;
           }, this.isType ? 5000 : 3000);
               
        });
        // switch (pathname) {
        //     case undefined:
        //         this.isType = true;
		// 		this.isWave = true;
        //         break;
        //     case "2":
        //         this.isType = false;
		// 		this.isWave = false;
        //         this.imageSources = [
        //             { id: 0, url: 'assets/images/xyzx1.jpg' },
        //             { id: 1, url: 'assets/images/xyzx2.jpg' },
        //             { id: 2, url: 'assets/images/xyzx3.jpg' },
        //         ];
        //         break;
        //     case "3":
        //         this.isType = false;
		// 		this.isWave = false;
        //         this.imageSources = [
        //             { id: 0, url: 'assets/images/3-1.jpg' },
        //             { id: 1, url: 'assets/images/3-2.jpg' },
        //             { id: 2, url: 'assets/images/3-3.jpg' },
        //         ];
        //         break;
        //     case "4":
        //         this.isType = false;
		// 		this.isWave = false;
        //         this.imageSources = [
        //             { id: 0, url: 'assets/images/zi1.png' },
        //             { id: 1, url: 'assets/images/zi2.jpg' },
        //             { id: 2, url: 'assets/images/zi3.png' },
        //         ];
        //         break;
        //     case "5":
        //         this.isType = false;
		// 		this.isWave = false;
        //         this.imageSources = [
        //             { id: 0, url: 'assets/images/5-1.jpg' },
        //             { id: 1, url: 'assets/images/5-2.jpg' },
        //             { id: 2, url: 'assets/images/5-3.jpg' },
        //         ];
        //         break;
        //     case "6":
        //         this.isType = false;
		// 		this.isWave = false;
        //         this.imageSources = [
        //             { id: 0, url: 'assets/images/6-1.jpg' },
        //             { id: 1, url: 'assets/images/6-2.jpg' },
        //             { id: 2, url: 'assets/images/6-3.jpg' },
        //         ];
        //         break;
        //     case "7":
        //         this.isType = false;
		// 		this.isWave = false;
        //         this.imageSources = [
        //             { id: 0, url: 'assets/images/7-1.jpg' },
        //             { id: 1, url: 'assets/images/7-2.jpg' },
        //             { id: 2, url: 'assets/images/7-3.jpg' },
        //         ];
        //         break;
        //     case "8":
        //         this.isType = false;
		// 		this.isWave = false;
        //         this.imageSources =
        //             [
        //                 { id: 0, url: 'assets/images/8-2.jpg' }
        //             ];
        //         break;
        //     case "9":
        //         this.isType = false;
		// 		this.isWave = false;
        //         this.imageSources =
        //             [
        //                 { id: 0, url: 'assets/images/9-1.jpg' },
        //                 { id: 1, url: 'assets/images/9-2.jpg' },
        //                 { id: 2, url: 'assets/images/9-3.jpg' },
        //             ];
        //         break;
		// 	default:
        //         this.isType = false;
		// 		this.isWave = false;
        //         this.imageSources =
        //             [
        //                 { id: 0, url: 'assets/images/9-1.jpg' },
        //                 { id: 1, url: 'assets/images/9-2.jpg' },
        //                 { id: 2, url: 'assets/images/9-3.jpg' },
        //             ];
        // };
    }
}
