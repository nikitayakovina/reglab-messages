import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import {provideHttpClient} from '@angular/common/http';
import {authReducer, channelReducer, messageReducer, userReducer} from './store/reducers';
import {AuthEffects, ChannelEffects, MessageEffects, UserEffects} from './store/effects';
import {provideEffects} from '@ngrx/effects';

export const API_DELAY = 300;

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideStore({
      auth: authReducer,
      channels: channelReducer,
      users: userReducer,
      messages: messageReducer,
    }),
    provideEffects([AuthEffects, ChannelEffects, UserEffects, MessageEffects]),
    provideHttpClient()
  ]
};
