import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Hippo } from '../_objects/models/hippo';
import { HippoService } from '../_services/hippo.service';
import { NotifyService } from '../_services/notify.service';

@Injectable()
export class HippoList implements Resolve<Hippo[]> {

    constructor(private _hippoService: HippoService, private _notifyService: NotifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Hippo[]> {
        return this._hippoService.listHippos().pipe(
            catchError(error => {
                this._notifyService.error(error);
                return of(null);
            })
        );
    }
}