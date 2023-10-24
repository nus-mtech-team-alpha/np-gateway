import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../claim.test-samples';

import { ClaimFormService } from './claim-form.service';

describe('Claim Form Service', () => {
  let service: ClaimFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimFormService);
  });

  describe('Service methods', () => {
    describe('createClaimFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClaimFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateFiled: expect.any(Object),
            status: expect.any(Object),
            claimType: expect.any(Object),
            hours: expect.any(Object),
            lecturer: expect.any(Object),
            module: expect.any(Object),
          })
        );
      });

      it('passing IClaim should create a new form with FormGroup', () => {
        const formGroup = service.createClaimFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateFiled: expect.any(Object),
            status: expect.any(Object),
            claimType: expect.any(Object),
            hours: expect.any(Object),
            lecturer: expect.any(Object),
            module: expect.any(Object),
          })
        );
      });
    });

    describe('getClaim', () => {
      it('should return NewClaim for default Claim initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createClaimFormGroup(sampleWithNewData);

        const claim = service.getClaim(formGroup) as any;

        expect(claim).toMatchObject(sampleWithNewData);
      });

      it('should return NewClaim for empty Claim initial value', () => {
        const formGroup = service.createClaimFormGroup();

        const claim = service.getClaim(formGroup) as any;

        expect(claim).toMatchObject({});
      });

      it('should return IClaim', () => {
        const formGroup = service.createClaimFormGroup(sampleWithRequiredData);

        const claim = service.getClaim(formGroup) as any;

        expect(claim).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClaim should not enable id FormControl', () => {
        const formGroup = service.createClaimFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClaim should disable id FormControl', () => {
        const formGroup = service.createClaimFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
