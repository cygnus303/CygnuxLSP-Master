import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { DownloadPODResponse } from '../models/trackTrace.model';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  /**
   * Export data to Excel
   * @param data Array of objects to be exported
   * @param fileName Name of the exported Excel file
   */
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

async downloadPODsAsZip(podList: DownloadPODResponse[], zipFileName: string = 'PODs') {
    const zip = new JSZip();
    const usedNames = new Set<string>();

    for (const pod of podList) {
      try {
        const res = await fetch(pod.podLink); // ✅ fetch only now!
        if (!res.ok) throw new Error(`Failed: ${pod.podLink}`);
        const blob = await res.blob();

        const baseName = `${pod.docketNo}_${pod.transporterDesc}`.replace(/[^\w.-]/g, '_');
        let fileName = `${baseName}.jpg`;
        let i = 1;
        while (usedNames.has(fileName)) {
          fileName = `${baseName}_${i++}.jpg`;
        }
        usedNames.add(fileName);

        zip.file(fileName, blob);
      } catch (e) {
        console.warn(`❌ Error with ${pod.docketNo}:`, e);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${zipFileName}.zip`);
  }
}
