import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClaimService } from '../service/claim.service';

import { ClaimComponent } from './claim.component';

describe('Claim Management Component', () => {
  let comp: ClaimComponent;
  let fixture: ComponentFixture<ClaimComponent>;
  let service: ClaimService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'claim', component: ClaimComponent }]), HttpClientTestingModule, ClaimComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ClaimComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClaimComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ClaimService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.claims?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to claimService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getClaimIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getClaimIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
