import { Inject, Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';
import { Observable } from 'rxjs';
import { TrackTraceResponse } from '../models/trackTrace.model';

@Injectable({
  providedIn: 'root'
})
export class TrackTraceService {

  constructor(
      @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
    ) {}

    GetTrackigList(id:string | null): Observable<IApiBaseResponse<TrackTraceResponse[]>> {
        return this.apiHandlerService.Get(`Tracking/GetTrackigList?docketNOs=${id}`);
      }
}
