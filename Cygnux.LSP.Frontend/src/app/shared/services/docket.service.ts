import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';
import { CommonResponse } from '../models/lsp.model';
import { AddDocketRequest, DocketResponse } from '../models/docket.model';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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
  ) { }
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

  exportToExcel(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Errors': worksheet },
      SheetNames: ['Errors']
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    saveAs(blob, `${fileName}.xlsx`);
  }

  StatusInvalidFile(data: any[], fileName: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invalid Dockets');

    // Add headerss
    worksheet.columns = [
      { header: 'Docket Number', key: 'docketNumber', width: 20 },
      { header: 'Next Docket Status', key: 'nextDocketStatus', width: 20 },
      { header: 'Customer Name', key: 'customerName', width: 20 },
      { header: 'LSP Name', key: 'lspName', width: 20 },
      { header: 'Status Date', key: 'statusDate', width: 15 },
      { header: 'Error Message', key: 'errorMessage', width: 40 },
    ];

    // Add rows and apply color formatting
    data.forEach((item) => {
      const row = worksheet.addRow(item);
      const errorCell = row.getCell('errorMessage');
      errorCell.font = {
        color: {
          argb: item.errorMessage === 'Success' ? 'FF008000' : 'FFFF0000', // Green or Red
        }
      };
    });

    // Write the file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, `${fileName}.xlsx`);
    });
  }

  importInvalidFile(data: any[], fileName: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invalid Dockets');

    // Define only the required columns
    worksheet.columns = [
      { header: 'Customer Name', key: 'customerName', width: 20 },
      { header: 'LSP Name', key: 'lspName', width: 20 },
      { header: 'Docket No', key: 'docketNo', width: 15 },
      { header: 'Invoice No', key: 'invoiceNo', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'From Location', key: 'fromLocation', width: 20 },
      { header: 'To Location', key: 'toLocation', width: 20 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Mode of Transport', key: 'modeOfTransporter', width: 25 },
      { header: 'Error Message', key: 'errorMessage', width: 50 },
    ];

    // Add rows and apply formatting
    data.forEach(item => {
      const row = worksheet.addRow({
        customerName: item.customerName,
        lspName: item.lspName,
        docketNo: item.docketNo,
        invoiceNo: item.invoiceNo,
        date: item.date,
        fromLocation: item.fromLocation,
        toLocation: item.toLocation,
        quantity: item.quantity,
        modeOfTransporter: item.modeOfTransporter,
        errorMessage: item.errorMessage || 'Success'
      });

      // Get cell for errorMessage
      const errorCell = row.getCell('errorMessage');
      const isSuccess = !item.errorMessage;

      errorCell.font = {
        color: { argb: isSuccess ? 'FF008000' : 'FFFF0000' } // green or red
      };
    });

    // Save the file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      FileSaver.saveAs(blob, `${fileName}.xlsx`);
    });
  }

  getDocketList(userId: string, filters: any): Observable<IApiBaseResponse<DocketResponse[]>> {
    return this.apiHandlerService.Get(`Docket/GetDocketList?userId=${userId}`, filters);
  }

  importDocket(formData: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('docket/import', formData);
  }
  getDocketDetails(id: string): Observable<IApiBaseResponse<DocketResponse>> {
    return this.apiHandlerService.Get(`docket/GetDocketDetail?docketId=${id}`);
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

  docketCancel(id: string,userId:string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch(`docket/DocketCancel?id=${id}&userId=${userId}`, null);
  }

  docketReject(payload:any): Observable<IApiBaseResponse<CommonResponse>> {
      return this.apiHandlerService.Patch(`docket/DocketReject`,payload);
  } 

  uploadDocket(formData: any) {
    return this.apiHandlerService.Post(`Docket/ImportPOD`, formData);
  }

  getLocationData(filters: any) {
    return this.apiHandlerService.Get(`Docket/GetDropdowndata`, filters);
  }

  validateDocketList(id: string, formData: any) {
    return this.apiHandlerService.Post(`Docket/ValidateDocketList?customerid=${id}`, formData);
  }

  getTrackingList(codeType: string) {
    return this.apiHandlerService.Get(`Docket/TrackingList?codetype=${codeType}`);
  }

  getCityData(stcd: string) {
    return this.apiHandlerService.Get(`Docket/GetCityData?stcd=${stcd}`);
  }

  GetCityDataDocket(SearchTerm: string) {
    return this.apiHandlerService.Get(`Docket/GetCityData_Docket?SearchTerm=${SearchTerm}`);
  }

  getStateData(searchTerm: string) {
    return this.apiHandlerService.Get(`Docket/GetStateData?SearchTerm=${searchTerm}`);
  }

  // getDestinationToData(filters:any){
  //   return this.apiHandlerService.Get(`Docket/GetDropdowndataTo`,filters);
  // }

  getDocketDetail(docketNo: number) {
    return this.apiHandlerService.Get(`Docket/FetchDocData?docketno=${docketNo}`);
  }

   GetLSPForDocket(data:any) {
    const queryParams = new URLSearchParams(data).toString();
    return this.apiHandlerService.Get(`Docket/GetLSPForDocket?${queryParams}`);
  }

  InsertExcelUplaodDocketData(id: string, formData: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post(`Docket/InsertExcelUplaodDocketData?entryBy=${id}`, formData);
  }

  downloadSampleDocketUpload(login: string): Observable<Blob> {
    return this.apiHandlerService.DownloadFile(`Docket/DownloadSampleDocketUpload?login=${login}`);
  }

  downloadSampleStatusUpload(login: string): Observable<Blob> {
    return this.apiHandlerService.DownloadFile(`Docket/DownloadSampleStatusUpload?login=${login}`);
  }

  validateDocketStatus(id: string, formData: any) {
    return this.apiHandlerService.Post(`Docket/ValidateDocketStatus?Lspid=${id}`, formData);
  }
  updateDocketStatus(id: string, formData: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post(`Docket/UpdateDocketStatus?entryBy=${id}`, formData);
  }

  singleUpdateDocketSts(id: string, userId: string, formData: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post(`Docket/SingleUpdateDocketSts?DocketId=${id}&user=${userId}`, formData);
  }

  DownloadSampleForPODupload(login: string): Observable<Blob> {
    return this.apiHandlerService.DownloadFile(`Docket/DownloadSampleForPODupload?login=${login}`);
  }

  validatePOD(id: string, formData: any) {
    return this.apiHandlerService.Post(`Docket/ValidatePODUpload?lspuser=${id}`, formData);
  }

  singlePOD(docketNumber: string, id: string, formData: any) {
    return this.apiHandlerService.Post(`Docket/SinglePODUpload?docketNo=${docketNumber}&lspuser=${id}`, formData);
  }

  downloadDocketData(id: string): Observable<IApiBaseResponse<DocketResponse[]>> {
    return this.apiHandlerService.Get(`Docket/DownloadDocket?userId=${id}`);
  }
}
