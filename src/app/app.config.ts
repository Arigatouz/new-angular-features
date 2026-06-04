import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideExperimentalWebMcpTools,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideExperimentalWebMcpForms } from '@angular/forms/signals';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // provideExperimentalWebMcpTools([]),
    provideExperimentalWebMcpForms(),

  ],
};
