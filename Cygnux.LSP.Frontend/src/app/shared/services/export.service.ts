import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { DownloadPODResponse } from '../models/trackTrace.model';
import { SweetAlertService } from './toastr.service';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';


@Injectable({
  providedIn: 'root',
})
export class ExportService {

  /**
   * Export data to Excel
   * @param data Array of objects to be exported
   * @param fileName Name of the exported Excel file
   */

    constructor( 
     private sweetAlertService: SweetAlertService,
    ){}
  exportToExcel(data: any[], fileName: string = 'exported-data') {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, fileName);
  }

  /**
   * Save Excel file
   */
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, `${fileName}.xlsx`);
  }

  /**
   * Export data to CSV
   * @param data Array of objects to be exported
   * @param fileName Name of the exported CSV file
   */
  exportToCSV(data: any[], fileName: string = 'exported-data') {
    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName}.csv`);
  }

  /**
   * Convert JSON data to CSV string
   */
  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    const header = Object.keys(data[0]).join(',');
    const rows = data.map((row) => Object.values(row).join(','));
    return [header, ...rows].join('\n');
  }

// async downloadPODsAsZip(podList: DownloadPODResponse[], zipFileName: string = 'PODs') {
//     const zip = new JSZip();
//     const usedNames = new Set<string>();

//     for (const pod of podList) {
//       try {
//         const res = await fetch(pod.podLink); // ✅ fetch only now!
//         if (!res.ok) throw new Error(`Failed: ${pod.podLink}`);
//         const blob = await res.blob();

//         const baseName = `${pod.docketNo}_${pod.transporterDesc}`.replace(/[^\w.-]/g, '_');
//         let fileName = `${baseName}.jpg`;
//         let i = 1;
//         while (usedNames.has(fileName)) {
//           fileName = `${baseName}_${i++}.jpg`;
//         }
//         usedNames.add(fileName);

//         zip.file(fileName, blob);
//       } catch (e) {
//         console.warn(`❌ Error with ${pod.docketNo}:`, e);
//       }
//     }

//     const zipBlob = await zip.generateAsync({ type: 'blob' });
//     saveAs(zipBlob, `${zipFileName}.zip`);
//   }


async downloadPODsAsZip(podList: DownloadPODResponse[], zipFileName: string = 'PODs') {
  const zip = new JSZip();
  const usedNames = new Set<string>();
  const retryLimit = 1;
  const forceHTTPS = true;

  const fetchWithRetry = async (url: string, retries = retryLimit): Promise<Blob | null> => {
    try {
      const finalUrl = forceHTTPS ? url.replace(/^http:/, 'https:') : url;
      const res = await fetch(finalUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.blob();
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retrying ${url}... (${retryLimit - retries + 1})`);
        return fetchWithRetry(url, retries - 1);
      } else {
        console.error(`❌ Failed to fetch ${url}:`, error);
        return null;
      }
    }
  };

  if (!podList || podList.length === 0) {
    this.sweetAlertService.info('No PODs found for the selected date range.');
    return;
  }

  for (const pod of podList) {
    const podUrl = pod.podLink;
    const blob = await fetchWithRetry(podUrl);

    if (blob) {
      const ext = podUrl.split('.').pop()?.toLowerCase() || 'jpg';
      const baseName = `${pod.docketNo}_${pod.transporterDesc}`.replace(/[^\w.-]/g, '_');
      let fileName = `${baseName}.${ext}`;
      let i = 1;
      while (usedNames.has(fileName)) {
        fileName = `${baseName}_${i++}.${ext}`;
      }
      usedNames.add(fileName);
      zip.file(fileName, blob);
    } else {
      console.warn(`Skipping ${pod.docketNo}: Could not download image.`);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `${zipFileName}.zip`);
  this.sweetAlertService.success('PODs downloaded successfully.');
}
exportInvalidTatData(data: any[], fileName: string): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invalid TAT');

    worksheet.columns = [
      { header: 'CustomerName', key: 'customerName', width: 20 },
      { header: 'LspName', key: 'lspName', width: 20 },
      { header: 'Product', key: 'product', width: 20 },
      { header: 'Origin', key: 'origin', width: 20 },
      { header: 'Destination', key: 'destination', width: 20 },
      { header: 'RateperKG', key: 'rateperKG', width: 15 },
      { header: 'Priority', key: 'priority', width: 10 },
      { header: 'BookingType', key: 'bookingType', width: 15 },
      { header: 'Mode', key: 'mode', width: 10 },
      { header: 'TAT', key: 'tat', width: 10 },
      { header: 'Error Message', key: 'errorMessage', width: 40 },
    ];

    data.forEach((item) => {
      const row = worksheet.addRow(item);
      const errorCell = row.getCell('errorMessage');
      errorCell.font = {
        color: {
          argb: item.errorMessage?.toLowerCase() === 'success' ? 'FF008000' : 'FFFF0000'
        }
      };
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      FileSaver.saveAs(blob, `${fileName}.xlsx`);
    });
  }

}
