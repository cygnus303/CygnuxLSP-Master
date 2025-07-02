import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchList',
  standalone: true
})
export class SearchListPipe implements PipeTransform {
//  transform(dockets: any[], searchText: string): any[] {
//     if (!dockets || !searchText) {
//       return dockets;
//     }

//     searchText = searchText.toLowerCase();
//     return dockets.filter(docket =>
//       docket.docketNo?.toLowerCase().includes(searchText) ||
//       docket.transporterDesc?.toLowerCase().includes(searchText) ||
//       docket.customerName?.toLowerCase().includes(searchText) ||
//       docket.fromLocation?.toLowerCase().includes(searchText) ||
//       docket.toLocation?.toLowerCase().includes(searchText) ||
//       docket.currentStatusDesc?.toLowerCase().includes(searchText)
//     );
//   }
 transform(items: any[], searchText: string, keys?: string[]): any[] {
  if (!items || !searchText) return items;
  searchText = searchText.toLowerCase();

  return items.filter(item => {
    if (typeof item === 'string') {
      return item.toLowerCase().includes(searchText);
    }

    if (keys && keys.length) {
      return keys.some(key => {
        const value = item[key];
        return value?.toString().toLowerCase().includes(searchText);
      });
    } else {
      return Object.values(item).some(val =>
        val?.toString().toLowerCase().includes(searchText)
      );
    }
  });
}

}
