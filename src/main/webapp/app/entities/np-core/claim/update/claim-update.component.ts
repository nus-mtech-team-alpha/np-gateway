import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClaimFormService, ClaimFormGroup } from './claim-form.service';
import { IClaim } from '../claim.model';
import { ClaimService } from '../service/claim.service';
import { ILecturer } from 'app/entities/np-core/lecturer/lecturer.model';
import { LecturerService } from 'app/entities/np-core/lecturer/service/lecturer.service';
import { IModule } from 'app/entities/np-core/module/module.model';
import { ModuleService } from 'app/entities/np-core/module/service/module.service';

@Component({
  standalone: true,
  selector: 'jhi-claim-update',
  templateUrl: './claim-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ClaimUpdateComponent implements OnInit {
  isSaving = false;
  claim: IClaim | null = null;

  lecturersSharedCollection: ILecturer[] = [];
  modulesSharedCollection: IModule[] = [];

  editForm: ClaimFormGroup = this.claimFormService.createClaimFormGroup();

  constructor(
    protected claimService: ClaimService,
    protected claimFormService: ClaimFormService,
    protected lecturerService: LecturerService,
    protected moduleService: ModuleService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLecturer = (o1: ILecturer | null, o2: ILecturer | null): boolean => this.lecturerService.compareLecturer(o1, o2);

  compareModule = (o1: IModule | null, o2: IModule | null): boolean => this.moduleService.compareModule(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ claim }) => {
      this.claim = claim;
      if (claim) {
        this.updateForm(claim);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const claim = this.claimFormService.getClaim(this.editForm);
    if (claim.id !== null) {
      this.subscribeToSaveResponse(this.claimService.update(claim));
    } else {
      this.subscribeToSaveResponse(this.claimService.create(claim));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClaim>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(claim: IClaim): void {
    this.claim = claim;
    this.claimFormService.resetForm(this.editForm, claim);

    this.lecturersSharedCollection = this.lecturerService.addLecturerToCollectionIfMissing<ILecturer>(
      this.lecturersSharedCollection,
      claim.lecturer
    );
    this.modulesSharedCollection = this.moduleService.addModuleToCollectionIfMissing<IModule>(this.modulesSharedCollection, claim.module);
  }

  protected loadRelationshipsOptions(): void {
    this.lecturerService
      .query()
      .pipe(map((res: HttpResponse<ILecturer[]>) => res.body ?? []))
      .pipe(
        map((lecturers: ILecturer[]) => this.lecturerService.addLecturerToCollectionIfMissing<ILecturer>(lecturers, this.claim?.lecturer))
      )
      .subscribe((lecturers: ILecturer[]) => (this.lecturersSharedCollection = lecturers));

    this.moduleService
      .query()
      .pipe(map((res: HttpResponse<IModule[]>) => res.body ?? []))
      .pipe(map((modules: IModule[]) => this.moduleService.addModuleToCollectionIfMissing<IModule>(modules, this.claim?.module)))
      .subscribe((modules: IModule[]) => (this.modulesSharedCollection = modules));
  }
}
