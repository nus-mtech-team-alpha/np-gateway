import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ILecturer } from '../lecturer.model';
import { LecturerService } from '../service/lecturer.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './lecturer-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class LecturerDeleteDialogComponent {
  lecturer?: ILecturer;

  constructor(protected lecturerService: LecturerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.lecturerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
