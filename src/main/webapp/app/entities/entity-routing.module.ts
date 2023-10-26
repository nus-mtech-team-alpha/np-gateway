import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'lecturer',
        data: { pageTitle: 'Lecturers' },
        loadChildren: () => import('./np-core/lecturer/lecturer.routes'),
      },
      {
        path: 'module',
        data: { pageTitle: 'Modules' },
        loadChildren: () => import('./np-core/module/module.routes'),
      },
      {
        path: 'claim',
        data: { pageTitle: 'Claims' },
        loadChildren: () => import('./np-core/claim/claim.routes'),
      },
      {
        path: 'claim/summary',
        data: { pageTitle: 'Claims Summary' },
        loadChildren: () => import('./np-core/claim/claim.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
