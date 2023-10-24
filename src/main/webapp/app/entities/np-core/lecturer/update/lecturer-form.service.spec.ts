import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../lecturer.test-samples';

import { LecturerFormService } from './lecturer-form.service';

describe('Lecturer Form Service', () => {
  let service: LecturerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LecturerFormService);
  });

  describe('Service methods', () => {
    describe('createLecturerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLecturerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            email: expect.any(Object),
            shortEmail: expect.any(Object),
            workdayId: expect.any(Object),
          })
        );
      });

      it('passing ILecturer should create a new form with FormGroup', () => {
        const formGroup = service.createLecturerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            email: expect.any(Object),
            shortEmail: expect.any(Object),
            workdayId: expect.any(Object),
          })
        );
      });
    });

    describe('getLecturer', () => {
      it('should return NewLecturer for default Lecturer initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLecturerFormGroup(sampleWithNewData);

        const lecturer = service.getLecturer(formGroup) as any;

        expect(lecturer).toMatchObject(sampleWithNewData);
      });

      it('should return NewLecturer for empty Lecturer initial value', () => {
        const formGroup = service.createLecturerFormGroup();

        const lecturer = service.getLecturer(formGroup) as any;

        expect(lecturer).toMatchObject({});
      });

      it('should return ILecturer', () => {
        const formGroup = service.createLecturerFormGroup(sampleWithRequiredData);

        const lecturer = service.getLecturer(formGroup) as any;

        expect(lecturer).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILecturer should not enable id FormControl', () => {
        const formGroup = service.createLecturerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLecturer should disable id FormControl', () => {
        const formGroup = service.createLecturerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
