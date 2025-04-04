import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MenuRoleResponse } from '../models/menu.model';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  loading = new BehaviorSubject(false);
  isLoading = this.loading.asObservable();
  activeNavigationUrl = new Subject<string>()
  menuRoleList:MenuRoleResponse | null=null;
  activemenuRoleList = new BehaviorSubject<any>(null);

  updateLoader(isLoading: boolean) {
    this.loading.next(isLoading);
  }
}
