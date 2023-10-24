import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IClaim } from '../claim.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../claim.test-samples';

import { ClaimService, RestClaim } from './claim.service';

const requireRestSample: RestClaim = {
  ...sampleWithRequiredData,
  dateFiled: sampleWithRequiredData.dateFiled?.format(DATE_FORMAT),
};

describe('Claim Service', () => {
  let service: ClaimService;
  let httpMock: HttpTestingController;
  let expectedResult: IClaim | IClaim[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClaimService);
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

    it('should create a Claim', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const claim = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(claim).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Claim', () => {
      const claim = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(claim).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Claim', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Claim', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Claim', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addClaimToCollectionIfMissing', () => {
      it('should add a Claim to an empty array', () => {
        const claim: IClaim = sampleWithRequiredData;
        expectedResult = service.addClaimToCollectionIfMissing([], claim);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(claim);
      });

      it('should not add a Claim to an array that contains it', () => {
        const claim: IClaim = sampleWithRequiredData;
        const claimCollection: IClaim[] = [
          {
            ...claim,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClaimToCollectionIfMissing(claimCollection, claim);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Claim to an array that doesn't contain it", () => {
        const claim: IClaim = sampleWithRequiredData;
        const claimCollection: IClaim[] = [sampleWithPartialData];
        expectedResult = service.addClaimToCollectionIfMissing(claimCollection, claim);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(claim);
      });

      it('should add only unique Claim to an array', () => {
        const claimArray: IClaim[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const claimCollection: IClaim[] = [sampleWithRequiredData];
        expectedResult = service.addClaimToCollectionIfMissing(claimCollection, ...claimArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const claim: IClaim = sampleWithRequiredData;
        const claim2: IClaim = sampleWithPartialData;
        expectedResult = service.addClaimToCollectionIfMissing([], claim, claim2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(claim);
        expect(expectedResult).toContain(claim2);
      });

      it('should accept null and undefined values', () => {
        const claim: IClaim = sampleWithRequiredData;
        expectedResult = service.addClaimToCollectionIfMissing([], null, claim, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(claim);
      });

      it('should return initial array if no Claim is added', () => {
        const claimCollection: IClaim[] = [sampleWithRequiredData];
        expectedResult = service.addClaimToCollectionIfMissing(claimCollection, undefined, null);
        expect(expectedResult).toEqual(claimCollection);
      });
    });

    describe('compareClaim', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClaim(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareClaim(entity1, entity2);
        const compareResult2 = service.compareClaim(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareClaim(entity1, entity2);
        const compareResult2 = service.compareClaim(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareClaim(entity1, entity2);
        const compareResult2 = service.compareClaim(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
