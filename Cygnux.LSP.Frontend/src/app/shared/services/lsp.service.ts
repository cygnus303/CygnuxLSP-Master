import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse, ParamsType } from '../interfaces/api-base-action-response';
import { AddLspRequest, CommonResponse, LspResponse } from '../models/lsp.model';


@Injectable({
  providedIn: 'root'
})
export class LspService {

  constructor(@Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService) { }

  getLspList(filters: any): Observable<IApiBaseResponse<LspResponse[]>> {
    return this.apiHandlerService.Get('lsp/GetLSPList', filters);
  }

  getLspDetails(id: string,userId:string): Observable<IApiBaseResponse<LspResponse>> {
    return this.apiHandlerService.Get(`lsp/GetDetails/${id}?userId=${userId}`);
  }

  addLsp(addLspRequest: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('lsp/AddLsp', addLspRequest);
  }

  updateLsp(id: string, addLspRequest: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('lsp/UpdateLsp/' + id, addLspRequest);
  }

  deleteLsp(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('lsp/DeleteLsp/' + id, null);
  }
}
