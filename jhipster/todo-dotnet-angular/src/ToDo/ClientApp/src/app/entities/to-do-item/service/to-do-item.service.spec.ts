import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { ItemStatus } from "app/entities/enumerations/item-status.model";
import { IToDoItem, ToDoItem } from "../to-do-item.model";

import { ToDoItemService } from "./to-do-item.service";

describe("ToDoItem Service", () => {
  let service: ToDoItemService;
  let httpMock: HttpTestingController;
  let elemDefault: IToDoItem;
  let expectedResult: IToDoItem | IToDoItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ToDoItemService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      description: "AAAAAAA",
      status: ItemStatus.ToDo,
    };
  });

  describe("Service methods", () => {
    it("should find an element", () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "GET" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it("should create a ToDoItem", () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service
        .create(new ToDoItem())
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "POST" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should update a ToDoItem", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: "BBBBBB",
          status: "BBBBBB",
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service
        .update(expected)
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "PUT" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should partial update a ToDoItem", () => {
      const patchObject = Object.assign({}, new ToDoItem());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service
        .partialUpdate(patchObject)
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "PATCH" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should return a list of ToDoItem", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: "BBBBBB",
          status: "BBBBBB",
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "GET" });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it("should delete a ToDoItem", () => {
      service.delete(123).subscribe((resp) => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: "DELETE" });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe("addToDoItemToCollectionIfMissing", () => {
      it("should add a ToDoItem to an empty array", () => {
        const toDoItem: IToDoItem = { id: 123 };
        expectedResult = service.addToDoItemToCollectionIfMissing([], toDoItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(toDoItem);
      });

      it("should not add a ToDoItem to an array that contains it", () => {
        const toDoItem: IToDoItem = { id: 123 };
        const toDoItemCollection: IToDoItem[] = [
          {
            ...toDoItem,
          },
          { id: 456 },
        ];
        expectedResult = service.addToDoItemToCollectionIfMissing(
          toDoItemCollection,
          toDoItem
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ToDoItem to an array that doesn't contain it", () => {
        const toDoItem: IToDoItem = { id: 123 };
        const toDoItemCollection: IToDoItem[] = [{ id: 456 }];
        expectedResult = service.addToDoItemToCollectionIfMissing(
          toDoItemCollection,
          toDoItem
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(toDoItem);
      });

      it("should add only unique ToDoItem to an array", () => {
        const toDoItemArray: IToDoItem[] = [
          { id: 123 },
          { id: 456 },
          { id: 74230 },
        ];
        const toDoItemCollection: IToDoItem[] = [{ id: 123 }];
        expectedResult = service.addToDoItemToCollectionIfMissing(
          toDoItemCollection,
          ...toDoItemArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it("should accept varargs", () => {
        const toDoItem: IToDoItem = { id: 123 };
        const toDoItem2: IToDoItem = { id: 456 };
        expectedResult = service.addToDoItemToCollectionIfMissing(
          [],
          toDoItem,
          toDoItem2
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(toDoItem);
        expect(expectedResult).toContain(toDoItem2);
      });

      it("should accept null and undefined values", () => {
        const toDoItem: IToDoItem = { id: 123 };
        expectedResult = service.addToDoItemToCollectionIfMissing(
          [],
          null,
          toDoItem,
          undefined
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(toDoItem);
      });

      it("should return initial array if no ToDoItem is added", () => {
        const toDoItemCollection: IToDoItem[] = [{ id: 123 }];
        expectedResult = service.addToDoItemToCollectionIfMissing(
          toDoItemCollection,
          undefined,
          null
        );
        expect(expectedResult).toEqual(toDoItemCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
