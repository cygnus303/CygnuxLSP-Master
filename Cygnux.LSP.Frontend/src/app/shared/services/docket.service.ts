import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse} from '../interfaces/api-base-action-response';
import { CommonResponse } from '../models/lsp.model';
import { AddDocketRequest, DocketResponse } from '../models/docket.model';
interface IRange {
  value: Date[];
  label: string;
}
@Injectable({
  providedIn: 'root',
})
export class DocketService {
  constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) {}
  dateRange: [Date, Date] = [new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)];
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
    {
      value: [
        new Date(new Date().getFullYear(), 0, 1), // First day of the year
        new Date(new Date().getFullYear(), 11, 31), // Last day of the year
      ],
      label: 'This Year',
    },
  ];

  getDocketList(filters:any): Observable<IApiBaseResponse<DocketResponse[]>> {
    return this.apiHandlerService.Get('docket/GetDocketList', filters);
  }

  importDocket(formData: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('docket/import', formData);
  }
  getDocketDetails(id: string,userId:string): Observable<IApiBaseResponse<DocketResponse>> {
    return this.apiHandlerService.Get(`docket/GetDocketDetail/${id}?userId=${userId}`);
  }

  addDocket(
    adddocketRequest: AddDocketRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('docket/AddDocket', adddocketRequest);
  }

  updateDocket(
    id: string,
    adddocketRequest: AddDocketRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('docket/UpdateDocket/' + id, adddocketRequest);
  }

  deleteDocket(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('docket/DeleteDocket/' + id, null);
  }
}
