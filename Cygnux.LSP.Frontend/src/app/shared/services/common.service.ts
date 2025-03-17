import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  loading = new BehaviorSubject(false);
  isLoading = this.loading.asObservable();

  updateLoader(isLoading: boolean) {
    this.loading.next(isLoading);
  }
}
