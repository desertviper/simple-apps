import { IUser } from "app/entities/user/user.model";
import { ItemStatus } from "app/entities/enumerations/item-status.model";

export interface IToDoItem {
  id?: number;
  description?: string | null;
  status?: ItemStatus | null;
  user?: IUser | null;
}

export class ToDoItem implements IToDoItem {
  constructor(
    public id?: number,
    public description?: string | null,
    public status?: ItemStatus | null,
    public user?: IUser | null
  ) {}
}

export function getToDoItemIdentifier(toDoItem: IToDoItem): number | undefined {
  return toDoItem.id;
}
