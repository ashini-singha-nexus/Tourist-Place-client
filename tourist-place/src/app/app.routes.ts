import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Places } from './features/places/places/places';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },
  { path: 'places', component: Places, canActivate: [authGuard] },
  { path: '**', redirectTo: 'auth/login' }
];
