import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { IClaim } from '../claim.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ClaimService } from '../service/claim.service';
import { ClaimDeleteDialogComponent } from '../delete/claim-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { IClaimSummary } from '../claim-summary.model';

@Component({
  standalone: true,
  selector: 'jhi-claim',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
})
export class SummaryComponent implements OnInit {
  claims?: IClaim[];

  summary: any[] = [];
  csTimetable?: IClaimSummary[] = [];
  csMl?: IClaimSummary[] = [];
  csOal?: IClaimSummary[] = [];
  csMakeup?: IClaimSummary[] = [];

  isLoading = false;

  predicate = 'id';
  ascending = true;

  month = new Date().toLocaleString('default', { month: 'long' });
  monthYear = this.month + " " + new Date().getFullYear();

  constructor(
    protected claimService: ClaimService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    private route: ActivatedRoute,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {
  }

  trackId = (_index: number, item: IClaim): number => this.claimService.getClaimIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  sum(csSummary: IClaimSummary[]): number {
    return csSummary.filter(cs => cs.cellType=='lecturerName').reduce((sum, current) => sum + (current.totalHours ?? 0), 0);
  }

  delete(claim: IClaim): void {
    const modalRef = this.modalService.open(ClaimDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.claim = claim;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.claims = this.refineData(dataFromBody);

    this.claims.sort((a, b) => (a.module?.name ?? '').localeCompare(b.module?.name ?? ''));
      this.claims.forEach(claim => {
        switch(claim.claimType){
          case 'TIMETABLE':
            this.groupData(this.csTimetable!, claim);
            break;
          case 'MODULE_LEADER':
            this.groupData(this.csMl!, claim);
            break;
          case 'OAL':
            this.groupData(this.csOal!, claim);
            break;
          case 'MAKE_UP':
            this.groupData(this.csMakeup!, claim);
            break;
        }
      });
      this.summary.push({
        label: 'Timetable',
        values: this.csTimetable
      });
      this.summary.push({
        label: 'Module Leader',
        values: this.csMl
      });
      this.summary.push({
        label: 'OAL',
        values: this.csOal
      });
      this.summary.push({
        label: 'Make Up',
        values: this.csMakeup
      });
  }

  private groupData(csToFill: IClaimSummary[], claim: IClaim){
    let matchingProgram = csToFill.find(cs => cs.program == claim.module?.name);
    if(!matchingProgram){
      csToFill.push({
        cellType: 'programName',
        program: claim.module?.name,
        totalHours: claim.hours
      });
    }else{
      matchingProgram.totalHours = matchingProgram.totalHours! + claim.hours!;
    }
    
    csToFill.push({
      cellType: 'lecturerName',
      program: claim.lecturer?.name,
      totalHours: claim.hours
    });
  }

  protected refineData(data: IClaim[]): IClaim[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IClaim[] | null): IClaim[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.claimService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
