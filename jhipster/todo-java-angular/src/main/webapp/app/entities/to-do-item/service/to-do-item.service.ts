import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IToDoItem, getToDoItemIdentifier } from '../to-do-item.model';

export type EntityResponseType = HttpResponse<IToDoItem>;
export type EntityArrayResponseType = HttpResponse<IToDoItem[]>;

@Injectable({ providedIn: 'root' })
export class ToDoItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/to-do-items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(toDoItem: IToDoItem): Observable<EntityResponseType> {
    return this.http.post<IToDoItem>(this.resourceUrl, toDoItem, { observe: 'response' });
  }

  update(toDoItem: IToDoItem): Observable<EntityResponseType> {
    return this.http.put<IToDoItem>(`${this.resourceUrl}/${getToDoItemIdentifier(toDoItem) as number}`, toDoItem, { observe: 'response' });
  }

  partialUpdate(toDoItem: IToDoItem): Observable<EntityResponseType> {
    return this.http.patch<IToDoItem>(`${this.resourceUrl}/${getToDoItemIdentifier(toDoItem) as number}`, toDoItem, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IToDoItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IToDoItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addToDoItemToCollectionIfMissing(toDoItemCollection: IToDoItem[], ...toDoItemsToCheck: (IToDoItem | null | undefined)[]): IToDoItem[] {
    const toDoItems: IToDoItem[] = toDoItemsToCheck.filter(isPresent);
    if (toDoItems.length > 0) {
      const toDoItemCollectionIdentifiers = toDoItemCollection.map(toDoItemItem => getToDoItemIdentifier(toDoItemItem)!);
      const toDoItemsToAdd = toDoItems.filter(toDoItemItem => {
        const toDoItemIdentifier = getToDoItemIdentifier(toDoItemItem);
        if (toDoItemIdentifier == null || toDoItemCollectionIdentifiers.includes(toDoItemIdentifier)) {
          return false;
        }
        toDoItemCollectionIdentifiers.push(toDoItemIdentifier);
        return true;
      });
      return [...toDoItemsToAdd, ...toDoItemCollection];
    }
    return toDoItemCollection;
  }
}
