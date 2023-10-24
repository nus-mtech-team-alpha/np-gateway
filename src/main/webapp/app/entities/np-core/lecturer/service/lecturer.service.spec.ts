import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILecturer } from '../lecturer.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../lecturer.test-samples';

import { LecturerService } from './lecturer.service';

const requireRestSample: ILecturer = {
  ...sampleWithRequiredData,
};

describe('Lecturer Service', () => {
  let service: LecturerService;
  let httpMock: HttpTestingController;
  let expectedResult: ILecturer | ILecturer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LecturerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Lecturer', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const lecturer = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(lecturer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Lecturer', () => {
      const lecturer = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(lecturer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Lecturer', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Lecturer', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Lecturer', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLecturerToCollectionIfMissing', () => {
      it('should add a Lecturer to an empty array', () => {
        const lecturer: ILecturer = sampleWithRequiredData;
        expectedResult = service.addLecturerToCollectionIfMissing([], lecturer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lecturer);
      });

      it('should not add a Lecturer to an array that contains it', () => {
        const lecturer: ILecturer = sampleWithRequiredData;
        const lecturerCollection: ILecturer[] = [
          {
            ...lecturer,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLecturerToCollectionIfMissing(lecturerCollection, lecturer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Lecturer to an array that doesn't contain it", () => {
        const lecturer: ILecturer = sampleWithRequiredData;
        const lecturerCollection: ILecturer[] = [sampleWithPartialData];
        expectedResult = service.addLecturerToCollectionIfMissing(lecturerCollection, lecturer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lecturer);
      });

      it('should add only unique Lecturer to an array', () => {
        const lecturerArray: ILecturer[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const lecturerCollection: ILecturer[] = [sampleWithRequiredData];
        expectedResult = service.addLecturerToCollectionIfMissing(lecturerCollection, ...lecturerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const lecturer: ILecturer = sampleWithRequiredData;
        const lecturer2: ILecturer = sampleWithPartialData;
        expectedResult = service.addLecturerToCollectionIfMissing([], lecturer, lecturer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lecturer);
        expect(expectedResult).toContain(lecturer2);
      });

      it('should accept null and undefined values', () => {
        const lecturer: ILecturer = sampleWithRequiredData;
        expectedResult = service.addLecturerToCollectionIfMissing([], null, lecturer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lecturer);
      });

      it('should return initial array if no Lecturer is added', () => {
        const lecturerCollection: ILecturer[] = [sampleWithRequiredData];
        expectedResult = service.addLecturerToCollectionIfMissing(lecturerCollection, undefined, null);
        expect(expectedResult).toEqual(lecturerCollection);
      });
    });

    describe('compareLecturer', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLecturer(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLecturer(entity1, entity2);
        const compareResult2 = service.compareLecturer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLecturer(entity1, entity2);
        const compareResult2 = service.compareLecturer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLecturer(entity1, entity2);
        const compareResult2 = service.compareLecturer(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
