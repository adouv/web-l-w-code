import { trigger, style, state, animate, transition } from '@angular/animations';

export const fadeInAnimation =
    // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('fadeInAnimation', [
        state('*', style({
           opacity: 1
        })),
        transition(":enter", [
            style({ opacity: 0 }),
            animate(300, style({ opacity: 1 }))
            ]),
          transition(":leave", [
            animate(300, style({ opacity: 0 }))
            ])
    ]);
    