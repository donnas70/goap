import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';

//Service used to trigger event sharing between components 
@Injectable()
export class DataService {
    private notify = new Subject<any>();
    /**
     * Observable string streams
     */
    notifyObservable$ = this.notify.asObservable();

    constructor() { }

    public notifyOther(data: any) {
        if (data) {
            this.notify.next(data);
        }
    }
}