export class AppEvent extends EventTarget {
    emitEvent = <D = undefined>(type: string, detail?: D) => {
        const event = new CustomEvent(type, { detail });
        this.dispatchEvent(event);
    }
}

export type SubsribtionCallback<D> = (detail?: D) => void;
export interface SubscriptionObject {
    unsubscribe: () => void;
}

export class Subscription<D = undefined> {
    type: string;
    appEvent: AppEvent;

    constructor(type?: string, appEvent?: AppEvent){
        this.type = type ?? 'default';
        this.appEvent = appEvent || new AppEvent();
    }

    send = (data: D) => {
        this.appEvent.emitEvent(this.type, data);
    }

    subscribe = (callback: SubsribtionCallback<D>): SubscriptionObject => {
        const callbackWrapper = (event: Event) => {
            const customEvent = event as CustomEvent;
            callback(customEvent.detail);
        }

        this.appEvent.addEventListener(this.type, callbackWrapper);
        return {
            unsubscribe: () => {
                this.appEvent.removeEventListener(this.type, callbackWrapper);
            }
        }
    }
}