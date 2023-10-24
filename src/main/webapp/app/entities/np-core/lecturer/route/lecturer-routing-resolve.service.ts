import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILecturer } from '../lecturer.model';
import { LecturerService } from '../service/lecturer.service';

export const lecturerResolve = (route: ActivatedRouteSnapshot): Observable<null | ILecturer> => {
  const id = route.params['id'];
  if (id) {
    return inject(LecturerService)
      .find(id)
      .pipe(
        mergeMap((lecturer: HttpResponse<ILecturer>) => {
          if (lecturer.body) {
            return of(lecturer.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default lecturerResolve;
