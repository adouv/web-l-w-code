import { Directive, EventEmitter ,HostListener ,OnInit, Output, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/operator/debounceTime';

@Directive({
    selector: '[btnDebunce]',
})
export class btnDebunceDirective implements OnInit, OnDestroy{

    @Input() waitTime = 500;

    @Output() debounceClick = new EventEmitter();

    private clicks = new Subject<any>();
    private subscription: Subscription;

    @HostListener('click', ['$event'])
    clickEvent(evt) {
        evt.preventDefault();
        window[evt] ? evt.cancelBubble = true : evt.stopPropagation();
        this.clicks.next(evt);
    }

    ngOnInit() {
        this.subscription =  this.clicks.debounceTime(this.waitTime).subscribe( e => {
            this.debounceClick.emit(e);
        })
    }

    
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
 }