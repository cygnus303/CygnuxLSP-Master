import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchList',
  standalone: true
})
export class SearchListPipe implements PipeTransform {
 transform(dockets: any[], searchText: string): any[] {
    if (!dockets || !searchText) {
      return dockets;
    }

    searchText = searchText.toLowerCase();
    return dockets.filter(docket =>
      docket.docketNo?.toLowerCase().includes(searchText) ||
      docket.transporterDesc?.toLowerCase().includes(searchText) ||
      docket.customerName?.toLowerCase().includes(searchText) ||
      docket.fromLocation?.toLowerCase().includes(searchText) ||
      docket.toLocation?.toLowerCase().includes(searchText) ||
      docket.currentStatusDesc?.toLowerCase().includes(searchText)
    );
  }
}
