import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IToDoItem } from '../to-do-item.model';

@Component({
  selector: 'jhi-to-do-item-detail',
  templateUrl: './to-do-item-detail.component.html',
})
export class ToDoItemDetailComponent implements OnInit {
  toDoItem: IToDoItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ toDoItem }) => {
      this.toDoItem = toDoItem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
