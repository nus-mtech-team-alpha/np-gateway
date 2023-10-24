import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClaimDetailComponent } from './claim-detail.component';

describe('Claim Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ClaimDetailComponent,
              resolve: { claim: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(ClaimDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load claim on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ClaimDetailComponent);

      // THEN
      expect(instance.claim).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
