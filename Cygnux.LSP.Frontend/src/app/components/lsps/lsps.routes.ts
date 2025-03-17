import { Routes } from '@angular/router';
import { LspListComponent } from './lsp/lsp-list.component';
import { AuthGuard } from '../../shared/guards/auth.guard';

export const LspRoutes: Routes = [
  {
    path: '',
    component: LspListComponent
  }
];
