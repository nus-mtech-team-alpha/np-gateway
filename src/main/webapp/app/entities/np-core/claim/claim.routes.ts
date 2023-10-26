import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClaimComponent } from './list/claim.component';
import { ClaimDetailComponent } from './detail/claim-detail.component';
import { ClaimUpdateComponent } from './update/claim-update.component';
import ClaimResolve from './route/claim-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';
import { SummaryComponent } from './summary/summary.component';

const claimRoute: Routes = [
  {
    path: '',
    component: ClaimComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'summary',
    component: SummaryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    resolve: {
      claim: ClaimResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClaimDetailComponent,
    resolve: {
      claim: ClaimResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClaimUpdateComponent,
    resolve: {
      claim: ClaimResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClaimUpdateComponent,
    resolve: {
      claim: ClaimResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default claimRoute;
