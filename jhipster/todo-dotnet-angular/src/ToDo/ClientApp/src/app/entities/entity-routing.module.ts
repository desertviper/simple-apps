import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "to-do-item",
        data: { pageTitle: "ToDoItems" },
        loadChildren: () =>
          import("./to-do-item/to-do-item.module").then(
            (m) => m.ToDoItemModule
          ),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
