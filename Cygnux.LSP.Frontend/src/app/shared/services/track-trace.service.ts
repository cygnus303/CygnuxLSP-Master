import { Inject, Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';
import { Observable } from 'rxjs';
import { DocketCountResponse, DownloadPODResponse, IRange, TrackTraceResponse } from '../models/trackTrace.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrackTraceService {

  constructor( public httpClient: HttpClient ,
      @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
    ) {}

    // GetTrackigList(id:string | null,userid:string): Observable<IApiBaseResponse<TrackTraceResponse[]>> {
    //     return this.apiHandlerService.Get(`Tracking/GetTrackigList?docketNOs=${id}&userid=${userid}`);
    //   }

  GetTrackigList(id: string | null,userid: any, fromDate: string | null = null,toDate: string | null = null,skip: number = 0,take: number = 9): Observable<IApiBaseResponse<TrackTraceResponse[]>> {
    const params = new URLSearchParams();
    params.set('docketNOs', id ?? '');
    params.set('userid', userid);
    if (fromDate) params.set('fromDate', fromDate);
    if (toDate) params.set('toDate', toDate);
    params.set('skip', skip.toString());
    params.set('take', take.toString());

    return this.apiHandlerService.Get(`Tracking/GetTrackigList?${params.toString()}`);
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

    getTransportModeCount(id: string,fromDate:string,toDate:string): Observable<IApiBaseResponse<DocketCountResponse[]>> {
      return this.apiHandlerService.Get(`Tracking/GetTransportModeChartData?userid=${id}&fromDate=${fromDate}&toDate=${toDate}`);
    }

  //   DownloadPODZip(id: string, fromDate: string | null, toDate: string | null): Observable<IApiBaseResponse<CommonResponse>> {
  //   const url = `${environment.apiUrl}Tracking/GetDownloadPODData?userId=${id}&StartDate=${fromDate}&EndDate=${toDate}`;
  //   return this.apiHandlerService.Get(`Tracking/GetDownloadPODData?userId=${id}&StartDate=${fromDate}&EndDate=${toDate}`, { responseType: 'blob' });
  // }

 DownloadPODZip(id: string, fromDate: string | null, toDate: string | null): Observable<Blob> {
  const url = `${environment.apiUrl}Tracking/GetDownloadPODData?userId=${id}&StartDate=${fromDate}&EndDate=${toDate}`;
  return this.httpClient.get(url, { responseType: 'blob' });
}
}
