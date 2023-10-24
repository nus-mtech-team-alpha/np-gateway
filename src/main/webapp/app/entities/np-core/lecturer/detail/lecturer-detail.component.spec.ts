import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LecturerDetailComponent } from './lecturer-detail.component';

describe('Lecturer Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LecturerDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: LecturerDetailComponent,
              resolve: { lecturer: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(LecturerDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load lecturer on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', LecturerDetailComponent);

      // THEN
      expect(instance.lecturer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
