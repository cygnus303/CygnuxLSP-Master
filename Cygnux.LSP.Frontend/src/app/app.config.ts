import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
  provideAnimations(),
  provideHttpClient(withFetch()),
  provideToastr({
    timeOut: 3000,  // Optional timeout for auto-hide
    positionClass: 'toast-top-right',  // Position of the toast
    preventDuplicates: true,  // Prevent duplicate toasts
  }),
  provideHttpClient(withInterceptors([authInterceptor])),
  ]
};
