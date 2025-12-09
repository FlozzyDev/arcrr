import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Reports } from './reports/reports';
import { Raiders } from './raiders/raiders';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'reports', component: Reports },
  { path: 'raiders', component: Raiders },
];
