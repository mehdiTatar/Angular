import { Routes } from '@angular/router';
import { About } from './about/about';
import { Contact } from './contact/contact';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home').then(m => m.Home),
  },
  {
    path: 'conferences',
    loadComponent: () => import('./conference-list/conference-list').then(m => m.ConferenceList),
  },
  {
    // Route paramétrée : :id est récupéré dans ConferenceDetail via input()
    path: 'conferences/:id',
    loadComponent: () => import('./conference-detail/conference-detail').then(m => m.ConferenceDetail),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin/admin').then(m => m.Admin),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'ajouter',
        loadComponent: () => import('./admin/add-conference/add-conference').then(m => m.AddConference),
      },
    ],
  },
  // Routes simples : le composant est chargé directement (pas de lazy loading)
  { path: 'about', component: About },
  { path: 'contact', component: Contact },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];