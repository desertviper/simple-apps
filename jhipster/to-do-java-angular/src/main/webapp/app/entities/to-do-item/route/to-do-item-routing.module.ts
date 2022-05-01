import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ToDoItemComponent } from '../list/to-do-item.component';
import { ToDoItemDetailComponent } from '../detail/to-do-item-detail.component';
import { ToDoItemUpdateComponent } from '../update/to-do-item-update.component';
import { ToDoItemRoutingResolveService } from './to-do-item-routing-resolve.service';

const toDoItemRoute: Routes = [
  {
    path: '',
    component: ToDoItemComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ToDoItemDetailComponent,
    resolve: {
      toDoItem: ToDoItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ToDoItemUpdateComponent,
    resolve: {
      toDoItem: ToDoItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ToDoItemUpdateComponent,
    resolve: {
      toDoItem: ToDoItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(toDoItemRoute)],
  exports: [RouterModule],
})
export class ToDoItemRoutingModule {}
