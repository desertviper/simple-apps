import { TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  ActivatedRouteSnapshot,
  ActivatedRoute,
  Router,
  convertToParamMap,
} from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";

import { IToDoItem, ToDoItem } from "../to-do-item.model";
import { ToDoItemService } from "../service/to-do-item.service";

import { ToDoItemRoutingResolveService } from "./to-do-item-routing-resolve.service";

describe("ToDoItem routing resolve service", () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ToDoItemRoutingResolveService;
  let service: ToDoItemService;
  let resultToDoItem: IToDoItem | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest
      .spyOn(mockRouter, "navigate")
      .mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(ToDoItemRoutingResolveService);
    service = TestBed.inject(ToDoItemService);
    resultToDoItem = undefined;
  });

  describe("resolve", () => {
    it("should return IToDoItem returned by find", () => {
      // GIVEN
      service.find = jest.fn((id) => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService
        .resolve(mockActivatedRouteSnapshot)
        .subscribe((result) => {
          resultToDoItem = result;
        });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultToDoItem).toEqual({ id: 123 });
    });

    it("should return new IToDoItem if id is not provided", () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService
        .resolve(mockActivatedRouteSnapshot)
        .subscribe((result) => {
          resultToDoItem = result;
        });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultToDoItem).toEqual(new ToDoItem());
    });

    it("should route to 404 page if data not found in server", () => {
      // GIVEN
      jest
        .spyOn(service, "find")
        .mockReturnValue(
          of(new HttpResponse({ body: null as unknown as ToDoItem }))
        );
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService
        .resolve(mockActivatedRouteSnapshot)
        .subscribe((result) => {
          resultToDoItem = result;
        });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultToDoItem).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(["404"]);
    });
  });
});
