import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LecturerFormService, LecturerFormGroup } from './lecturer-form.service';
import { ILecturer } from '../lecturer.model';
import { LecturerService } from '../service/lecturer.service';

@Component({
  standalone: true,
  selector: 'jhi-lecturer-update',
  templateUrl: './lecturer-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class LecturerUpdateComponent implements OnInit {
  isSaving = false;
  lecturer: ILecturer | null = null;

  editForm: LecturerFormGroup = this.lecturerFormService.createLecturerFormGroup();

  constructor(
    protected lecturerService: LecturerService,
    protected lecturerFormService: LecturerFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lecturer }) => {
      this.lecturer = lecturer;
      if (lecturer) {
        this.updateForm(lecturer);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lecturer = this.lecturerFormService.getLecturer(this.editForm);
    if (lecturer.id !== null) {
      this.subscribeToSaveResponse(this.lecturerService.update(lecturer));
    } else {
      this.subscribeToSaveResponse(this.lecturerService.create(lecturer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILecturer>>): void {
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

  protected updateForm(lecturer: ILecturer): void {
    this.lecturer = lecturer;
    this.lecturerFormService.resetForm(this.editForm, lecturer);
  }
}
