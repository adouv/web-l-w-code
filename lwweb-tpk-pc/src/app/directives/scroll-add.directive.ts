import { Directive, HostListener, EventEmitter,OnInit, Output, Input, OnDestroy  } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/operator/debounceTime';

@Directive({
    selector: '[scrollAdd]',
})
export class ScrollAddDirective implements OnInit,OnDestroy {

    @Input() debuncTime = 500;

    @Output() scrollDebunce = new EventEmitter();

    @HostListener('scroll', ['$event'])
    ScrollEvent(evt) {
        let distance = evt.srcElement.clientHeight + evt.srcElement.scrollTop;
        this.scroll.next(distance);
    }

    private scroll = new Subject<any>();
    private subscription: Subscription;


    ngOnInit() {
        this.subscription = this.scroll.debounceTime(this.debuncTime).subscribe( e => {
            this.scrollDebunce.emit(e);
        })
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
 }