import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { IToDoItem } from "../to-do-item.model";
import { ToDoItemService } from "../service/to-do-item.service";

@Component({
  templateUrl: "./to-do-item-delete-dialog.component.html",
})
export class ToDoItemDeleteDialogComponent {
  toDoItem?: IToDoItem;

  constructor(
    protected toDoItemService: ToDoItemService,
    protected activeModal: NgbActiveModal
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.toDoItemService.delete(id).subscribe(() => {
      this.activeModal.close("deleted");
    });
  }
}
