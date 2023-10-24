import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IClaim, NewClaim } from '../claim.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClaim for edit and NewClaimFormGroupInput for create.
 */
type ClaimFormGroupInput = IClaim | PartialWithRequiredKeyOf<NewClaim>;

type ClaimFormDefaults = Pick<NewClaim, 'id'>;

type ClaimFormGroupContent = {
  id: FormControl<IClaim['id'] | NewClaim['id']>;
  dateFiled: FormControl<IClaim['dateFiled']>;
  status: FormControl<IClaim['status']>;
  claimType: FormControl<IClaim['claimType']>;
  hours: FormControl<IClaim['hours']>;
  lecturer: FormControl<IClaim['lecturer']>;
  module: FormControl<IClaim['module']>;
};

export type ClaimFormGroup = FormGroup<ClaimFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClaimFormService {
  createClaimFormGroup(claim: ClaimFormGroupInput = { id: null }): ClaimFormGroup {
    const claimRawValue = {
      ...this.getFormDefaults(),
      ...claim,
    };
    return new FormGroup<ClaimFormGroupContent>({
      id: new FormControl(
        { value: claimRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dateFiled: new FormControl(claimRawValue.dateFiled),
      status: new FormControl(claimRawValue.status),
      claimType: new FormControl(claimRawValue.claimType),
      hours: new FormControl(claimRawValue.hours),
      lecturer: new FormControl(claimRawValue.lecturer),
      module: new FormControl(claimRawValue.module),
    });
  }

  getClaim(form: ClaimFormGroup): IClaim | NewClaim {
    return form.getRawValue() as IClaim | NewClaim;
  }

  resetForm(form: ClaimFormGroup, claim: ClaimFormGroupInput): void {
    const claimRawValue = { ...this.getFormDefaults(), ...claim };
    form.reset(
      {
        ...claimRawValue,
        id: { value: claimRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ClaimFormDefaults {
    return {
      id: null,
    };
  }
}
