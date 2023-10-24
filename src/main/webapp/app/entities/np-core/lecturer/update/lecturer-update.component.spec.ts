import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LecturerFormService } from './lecturer-form.service';
import { LecturerService } from '../service/lecturer.service';
import { ILecturer } from '../lecturer.model';

import { LecturerUpdateComponent } from './lecturer-update.component';

describe('Lecturer Management Update Component', () => {
  let comp: LecturerUpdateComponent;
  let fixture: ComponentFixture<LecturerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lecturerFormService: LecturerFormService;
  let lecturerService: LecturerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), LecturerUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LecturerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LecturerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lecturerFormService = TestBed.inject(LecturerFormService);
    lecturerService = TestBed.inject(LecturerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const lecturer: ILecturer = { id: 456 };

      activatedRoute.data = of({ lecturer });
      comp.ngOnInit();

      expect(comp.lecturer).toEqual(lecturer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILecturer>>();
      const lecturer = { id: 123 };
      jest.spyOn(lecturerFormService, 'getLecturer').mockReturnValue(lecturer);
      jest.spyOn(lecturerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lecturer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lecturer }));
      saveSubject.complete();

      // THEN
      expect(lecturerFormService.getLecturer).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(lecturerService.update).toHaveBeenCalledWith(expect.objectContaining(lecturer));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILecturer>>();
      const lecturer = { id: 123 };
      jest.spyOn(lecturerFormService, 'getLecturer').mockReturnValue({ id: null });
      jest.spyOn(lecturerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lecturer: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lecturer }));
      saveSubject.complete();

      // THEN
      expect(lecturerFormService.getLecturer).toHaveBeenCalled();
      expect(lecturerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILecturer>>();
      const lecturer = { id: 123 };
      jest.spyOn(lecturerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lecturer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lecturerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
