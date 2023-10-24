import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILecturer, NewLecturer } from '../lecturer.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILecturer for edit and NewLecturerFormGroupInput for create.
 */
type LecturerFormGroupInput = ILecturer | PartialWithRequiredKeyOf<NewLecturer>;

type LecturerFormDefaults = Pick<NewLecturer, 'id'>;

type LecturerFormGroupContent = {
  id: FormControl<ILecturer['id'] | NewLecturer['id']>;
  name: FormControl<ILecturer['name']>;
  email: FormControl<ILecturer['email']>;
  shortEmail: FormControl<ILecturer['shortEmail']>;
  workdayId: FormControl<ILecturer['workdayId']>;
};

export type LecturerFormGroup = FormGroup<LecturerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LecturerFormService {
  createLecturerFormGroup(lecturer: LecturerFormGroupInput = { id: null }): LecturerFormGroup {
    const lecturerRawValue = {
      ...this.getFormDefaults(),
      ...lecturer,
    };
    return new FormGroup<LecturerFormGroupContent>({
      id: new FormControl(
        { value: lecturerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(lecturerRawValue.name),
      email: new FormControl(lecturerRawValue.email),
      shortEmail: new FormControl(lecturerRawValue.shortEmail),
      workdayId: new FormControl(lecturerRawValue.workdayId),
    });
  }

  getLecturer(form: LecturerFormGroup): ILecturer | NewLecturer {
    return form.getRawValue() as ILecturer | NewLecturer;
  }

  resetForm(form: LecturerFormGroup, lecturer: LecturerFormGroupInput): void {
    const lecturerRawValue = { ...this.getFormDefaults(), ...lecturer };
    form.reset(
      {
        ...lecturerRawValue,
        id: { value: lecturerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LecturerFormDefaults {
    return {
      id: null,
    };
  }
}
