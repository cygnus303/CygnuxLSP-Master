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

  getLspList(page: number = 1, pageSize: number = 100): Observable<IApiBaseResponse<LspResponse[]>> {
    let params: ParamsType = {
      page: page,
      pageSize: pageSize,
    };
    return this.apiHandlerService.Get('lsp', params);
  }

  getLspDetails(id: string): Observable<IApiBaseResponse<LspResponse>> {
    return this.apiHandlerService.Get('lsp/' + id);
  }

  addLsp(addLspRequest: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('lsp', addLspRequest);
  }

  updateLsp(id: string, addLspRequest: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('lsp/' + id, addLspRequest);
  }

  deleteLsp(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('lsp/' + id, null);
  }
}
