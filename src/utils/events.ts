import { EventEmitter } from 'events';

export class AppEvent extends EventEmitter {
    emitEvent = <D = undefined>(type: string, detail?: D) => {
        this.emit(type, detail);
    }
}

export type SubsribtionCallback<D> = (detail?: D) => void;
export interface SubscriptionObject {
    unsubscribe: () => void;
}

export class Subscription<D = undefined> {
    type: string;
    appEvent: AppEvent;

    constructor(type?: string, appEvent?: AppEvent) {
        this.type = type ?? 'default';
        this.appEvent = appEvent || new AppEvent();
    }

    send = (data: D) => {
        this.appEvent.emitEvent(this.type, data);
    }

    subscribe = (callback: SubsribtionCallback<D>): SubscriptionObject => {
        const callbackWrapper = (detail?: D) => {
            callback(detail);
        };

        this.appEvent.on(this.type, callbackWrapper);
        return {
            unsubscribe: () => {
                this.appEvent.off(this.type, callbackWrapper);
            }
        };
    }
}