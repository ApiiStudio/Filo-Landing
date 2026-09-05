import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';

export const routes: Routes = [
    { path: '', component: Landing},
    { path: 'portfolio/:slug', loadComponent: () => import('./features/landing/sections/portfolio/pages/project/project').then(m => m.Project)},
    { path: '**', redirectTo: '',},
];
