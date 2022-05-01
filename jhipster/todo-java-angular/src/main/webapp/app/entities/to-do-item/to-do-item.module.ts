import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ToDoItemComponent } from './list/to-do-item.component';
import { ToDoItemDetailComponent } from './detail/to-do-item-detail.component';
import { ToDoItemUpdateComponent } from './update/to-do-item-update.component';
import { ToDoItemDeleteDialogComponent } from './delete/to-do-item-delete-dialog.component';
import { ToDoItemRoutingModule } from './route/to-do-item-routing.module';

@NgModule({
  imports: [SharedModule, ToDoItemRoutingModule],
  declarations: [ToDoItemComponent, ToDoItemDetailComponent, ToDoItemUpdateComponent, ToDoItemDeleteDialogComponent],
  entryComponents: [ToDoItemDeleteDialogComponent],
})
export class ToDoItemModule {}
