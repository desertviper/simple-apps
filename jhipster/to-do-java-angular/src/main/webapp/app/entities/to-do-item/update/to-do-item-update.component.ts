import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IToDoItem, ToDoItem } from '../to-do-item.model';
import { ToDoItemService } from '../service/to-do-item.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ItemStatus } from 'app/entities/enumerations/item-status.model';

@Component({
  selector: 'jhi-to-do-item-update',
  templateUrl: './to-do-item-update.component.html',
})
export class ToDoItemUpdateComponent implements OnInit {
  isSaving = false;
  itemStatusValues = Object.keys(ItemStatus);

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    description: [],
    status: [],
    user: [],
  });

  constructor(
    protected toDoItemService: ToDoItemService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ toDoItem }) => {
      this.updateForm(toDoItem);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const toDoItem = this.createFromForm();
    if (toDoItem.id !== undefined) {
      this.subscribeToSaveResponse(this.toDoItemService.update(toDoItem));
    } else {
      this.subscribeToSaveResponse(this.toDoItemService.create(toDoItem));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IToDoItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(toDoItem: IToDoItem): void {
    this.editForm.patchValue({
      id: toDoItem.id,
      description: toDoItem.description,
      status: toDoItem.status,
      user: toDoItem.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, toDoItem.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IToDoItem {
    return {
      ...new ToDoItem(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      status: this.editForm.get(['status'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
