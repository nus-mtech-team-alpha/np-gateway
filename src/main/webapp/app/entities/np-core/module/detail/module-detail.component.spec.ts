import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ModuleDetailComponent } from './module-detail.component';

describe('Module Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ModuleDetailComponent,
              resolve: { module: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(ModuleDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load module on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ModuleDetailComponent);

      // THEN
      expect(instance.module).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
