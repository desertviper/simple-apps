import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of, EMPTY } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { IToDoItem, ToDoItem } from "../to-do-item.model";
import { ToDoItemService } from "../service/to-do-item.service";

@Injectable({ providedIn: "root" })
export class ToDoItemRoutingResolveService implements Resolve<IToDoItem> {
  constructor(protected service: ToDoItemService, protected router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<IToDoItem> | Observable<never> {
    const id = route.params["id"];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((toDoItem: HttpResponse<ToDoItem>) => {
          if (toDoItem.body) {
            return of(toDoItem.body);
          } else {
            this.router.navigate(["404"]);
            return EMPTY;
          }
        })
      );
    }
    return of(new ToDoItem());
  }
}
