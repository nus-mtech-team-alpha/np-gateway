import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LecturerComponent } from './list/lecturer.component';
import { LecturerDetailComponent } from './detail/lecturer-detail.component';
import { LecturerUpdateComponent } from './update/lecturer-update.component';
import LecturerResolve from './route/lecturer-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const lecturerRoute: Routes = [
  {
    path: '',
    component: LecturerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LecturerDetailComponent,
    resolve: {
      lecturer: LecturerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LecturerUpdateComponent,
    resolve: {
      lecturer: LecturerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LecturerUpdateComponent,
    resolve: {
      lecturer: LecturerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default lecturerRoute;
