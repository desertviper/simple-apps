import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IToDoItem } from "../to-do-item.model";
import { ToDoItemService } from "../service/to-do-item.service";
import { ToDoItemDeleteDialogComponent } from "../delete/to-do-item-delete-dialog.component";

@Component({
  selector: "jhi-to-do-item",
  templateUrl: "./to-do-item.component.html",
})
export class ToDoItemComponent implements OnInit {
  toDoItems?: IToDoItem[];
  isLoading = false;

  constructor(
    protected toDoItemService: ToDoItemService,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.toDoItemService.query().subscribe({
      next: (res: HttpResponse<IToDoItem[]>) => {
        this.isLoading = false;
        this.toDoItems = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IToDoItem): number {
    return item.id!;
  }

  delete(toDoItem: IToDoItem): void {
    const modalRef = this.modalService.open(ToDoItemDeleteDialogComponent, {
      size: "lg",
      backdrop: "static",
    });
    modalRef.componentInstance.toDoItem = toDoItem;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }
}
