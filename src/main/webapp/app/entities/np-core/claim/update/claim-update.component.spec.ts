import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClaimFormService } from './claim-form.service';
import { ClaimService } from '../service/claim.service';
import { IClaim } from '../claim.model';
import { ILecturer } from 'app/entities/np-core/lecturer/lecturer.model';
import { LecturerService } from 'app/entities/np-core/lecturer/service/lecturer.service';
import { IModule } from 'app/entities/np-core/module/module.model';
import { ModuleService } from 'app/entities/np-core/module/service/module.service';

import { ClaimUpdateComponent } from './claim-update.component';

describe('Claim Management Update Component', () => {
  let comp: ClaimUpdateComponent;
  let fixture: ComponentFixture<ClaimUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let claimFormService: ClaimFormService;
  let claimService: ClaimService;
  let lecturerService: LecturerService;
  let moduleService: ModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ClaimUpdateComponent],
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
      .overrideTemplate(ClaimUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClaimUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    claimFormService = TestBed.inject(ClaimFormService);
    claimService = TestBed.inject(ClaimService);
    lecturerService = TestBed.inject(LecturerService);
    moduleService = TestBed.inject(ModuleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Lecturer query and add missing value', () => {
      const claim: IClaim = { id: 456 };
      const lecturer: ILecturer = { id: 14962 };
      claim.lecturer = lecturer;

      const lecturerCollection: ILecturer[] = [{ id: 13313 }];
      jest.spyOn(lecturerService, 'query').mockReturnValue(of(new HttpResponse({ body: lecturerCollection })));
      const additionalLecturers = [lecturer];
      const expectedCollection: ILecturer[] = [...additionalLecturers, ...lecturerCollection];
      jest.spyOn(lecturerService, 'addLecturerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ claim });
      comp.ngOnInit();

      expect(lecturerService.query).toHaveBeenCalled();
      expect(lecturerService.addLecturerToCollectionIfMissing).toHaveBeenCalledWith(
        lecturerCollection,
        ...additionalLecturers.map(expect.objectContaining)
      );
      expect(comp.lecturersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Module query and add missing value', () => {
      const claim: IClaim = { id: 456 };
      const module: IModule = { id: 7124 };
      claim.module = module;

      const moduleCollection: IModule[] = [{ id: 279 }];
      jest.spyOn(moduleService, 'query').mockReturnValue(of(new HttpResponse({ body: moduleCollection })));
      const additionalModules = [module];
      const expectedCollection: IModule[] = [...additionalModules, ...moduleCollection];
      jest.spyOn(moduleService, 'addModuleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ claim });
      comp.ngOnInit();

      expect(moduleService.query).toHaveBeenCalled();
      expect(moduleService.addModuleToCollectionIfMissing).toHaveBeenCalledWith(
        moduleCollection,
        ...additionalModules.map(expect.objectContaining)
      );
      expect(comp.modulesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const claim: IClaim = { id: 456 };
      const lecturer: ILecturer = { id: 24091 };
      claim.lecturer = lecturer;
      const module: IModule = { id: 16005 };
      claim.module = module;

      activatedRoute.data = of({ claim });
      comp.ngOnInit();

      expect(comp.lecturersSharedCollection).toContain(lecturer);
      expect(comp.modulesSharedCollection).toContain(module);
      expect(comp.claim).toEqual(claim);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClaim>>();
      const claim = { id: 123 };
      jest.spyOn(claimFormService, 'getClaim').mockReturnValue(claim);
      jest.spyOn(claimService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ claim });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: claim }));
      saveSubject.complete();

      // THEN
      expect(claimFormService.getClaim).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(claimService.update).toHaveBeenCalledWith(expect.objectContaining(claim));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClaim>>();
      const claim = { id: 123 };
      jest.spyOn(claimFormService, 'getClaim').mockReturnValue({ id: null });
      jest.spyOn(claimService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ claim: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: claim }));
      saveSubject.complete();

      // THEN
      expect(claimFormService.getClaim).toHaveBeenCalled();
      expect(claimService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClaim>>();
      const claim = { id: 123 };
      jest.spyOn(claimService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ claim });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(claimService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLecturer', () => {
      it('Should forward to lecturerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(lecturerService, 'compareLecturer');
        comp.compareLecturer(entity, entity2);
        expect(lecturerService.compareLecturer).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareModule', () => {
      it('Should forward to moduleService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(moduleService, 'compareModule');
        comp.compareModule(entity, entity2);
        expect(moduleService.compareModule).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
