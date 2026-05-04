import {Routes} from '@angular/router';
import {authGuard, guestGuard} from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../app/components/chat/chat.component').then(m => m.ChatComponent),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../app/components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'user',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../app/components/user-profile/user-profile.component').then(m => m.UserProfileComponent),
  },
  {path: '**', redirectTo: ''},
];
