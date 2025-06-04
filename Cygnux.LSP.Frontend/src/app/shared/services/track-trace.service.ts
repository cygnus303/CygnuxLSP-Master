import { Inject, Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';
import { Observable } from 'rxjs';
import { DocketCountResponse, IRange, TrackTraceResponse } from '../models/trackTrace.model';

@Injectable({
  providedIn: 'root'
})
export class TrackTraceService {

  constructor(
      @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
    ) {}

    GetTrackigList(id:string | null,userid:string): Observable<IApiBaseResponse<TrackTraceResponse[]>> {
        return this.apiHandlerService.Get(`Tracking/GetTrackigList?docketNOs=${id}&userid=${userid}`);
      }

      ranges: IRange[] = [
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
      label: 'Last 7 Days',
    },
    {
      value: [new Date(), new Date()],
      label: 'Today',
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 1)),
        new Date(new Date().setDate(new Date().getDate() - 1)),
      ],
      label: 'Yesterday',
    },
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()],
      label: 'Last 30 Days',
    },
    {
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ],
      label: 'This Month',
    },
    {
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      ],
      label: 'Last Month',
    },
  ];

    getTrackigCountDetail(id: string,fromDate:string,toDate:string): Observable<IApiBaseResponse<DocketCountResponse[]>> {
      return this.apiHandlerService.Get(`Tracking/GetDashboardData?userid=${id}&fromDate=${fromDate}&toDate=${toDate}`);
    }
}
