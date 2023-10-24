import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILecturer, NewLecturer } from '../lecturer.model';

export type PartialUpdateLecturer = Partial<ILecturer> & Pick<ILecturer, 'id'>;

export type EntityResponseType = HttpResponse<ILecturer>;
export type EntityArrayResponseType = HttpResponse<ILecturer[]>;

@Injectable({ providedIn: 'root' })
export class LecturerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lecturers', 'np-core');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(lecturer: NewLecturer): Observable<EntityResponseType> {
    return this.http.post<ILecturer>(this.resourceUrl, lecturer, { observe: 'response' });
  }

  update(lecturer: ILecturer): Observable<EntityResponseType> {
    return this.http.put<ILecturer>(`${this.resourceUrl}/${this.getLecturerIdentifier(lecturer)}`, lecturer, { observe: 'response' });
  }

  partialUpdate(lecturer: PartialUpdateLecturer): Observable<EntityResponseType> {
    return this.http.patch<ILecturer>(`${this.resourceUrl}/${this.getLecturerIdentifier(lecturer)}`, lecturer, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILecturer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILecturer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLecturerIdentifier(lecturer: Pick<ILecturer, 'id'>): number {
    return lecturer.id;
  }

  compareLecturer(o1: Pick<ILecturer, 'id'> | null, o2: Pick<ILecturer, 'id'> | null): boolean {
    return o1 && o2 ? this.getLecturerIdentifier(o1) === this.getLecturerIdentifier(o2) : o1 === o2;
  }

  addLecturerToCollectionIfMissing<Type extends Pick<ILecturer, 'id'>>(
    lecturerCollection: Type[],
    ...lecturersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const lecturers: Type[] = lecturersToCheck.filter(isPresent);
    if (lecturers.length > 0) {
      const lecturerCollectionIdentifiers = lecturerCollection.map(lecturerItem => this.getLecturerIdentifier(lecturerItem)!);
      const lecturersToAdd = lecturers.filter(lecturerItem => {
        const lecturerIdentifier = this.getLecturerIdentifier(lecturerItem);
        if (lecturerCollectionIdentifiers.includes(lecturerIdentifier)) {
          return false;
        }
        lecturerCollectionIdentifiers.push(lecturerIdentifier);
        return true;
      });
      return [...lecturersToAdd, ...lecturerCollection];
    }
    return lecturerCollection;
  }
}
