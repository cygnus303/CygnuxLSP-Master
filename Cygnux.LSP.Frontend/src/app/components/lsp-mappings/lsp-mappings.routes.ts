import { Routes } from '@angular/router';
import { LspMappingListComponent } from './lsp-mapping/lsp-mapping-list.component';

export const LspMappingRoutes: Routes = [
  {
    path: 'list',
    component: LspMappingListComponent
  }
];
