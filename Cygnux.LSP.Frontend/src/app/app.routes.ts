import { Routes } from '@angular/router';
import { LoginGuard } from './shared/guards/login.guard';
import { FullComponent } from './components/layouts/full/full.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('../app/components/Identity/login.module').then(
        (m) => m.LoginModule
      ),
    canActivate: [LoginGuard],
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/customer',
        pathMatch: 'full',
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('./components/customers/customers.module').then(
            (m) => m.CustomerModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'lsp',
        loadChildren: () =>
          import('./components/lsps/lsps.module').then((m) => m.LspModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'lsp-mapping',
        loadChildren: () =>
          import('./components/lsp-mappings/lsp-mappings.module').then(
            (m) => m.LspMappingModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'lsp-tat',
        loadChildren: () =>
          import('./components/lsp-tats/lsp-tats.module').then(
            (m) => m.LspTatModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'role',
        loadChildren: () =>
          import('./components/roles/roles.module').then((m) => m.RoleModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./components/users/users.module').then((m) => m.UserModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'docket',
        loadChildren: () =>
          import('./components/dockets/docket.module').then(
            (m) => m.DocketModule
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
];
