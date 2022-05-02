import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, Subject, from } from "rxjs";

import { ToDoItemService } from "../service/to-do-item.service";
import { IToDoItem, ToDoItem } from "../to-do-item.model";

import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";

import { ToDoItemUpdateComponent } from "./to-do-item-update.component";

describe("ToDoItem Management Update Component", () => {
  let comp: ToDoItemUpdateComponent;
  let fixture: ComponentFixture<ToDoItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let toDoItemService: ToDoItemService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ToDoItemUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ToDoItemUpdateComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(ToDoItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    toDoItemService = TestBed.inject(ToDoItemService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe("ngOnInit", () => {
    it("Should call User query and add missing value", () => {
      const toDoItem: IToDoItem = { id: 456 };
      const user: IUser = { id: "b5046b38-7db1-4408-8946-873ecaa02e4c" };
      toDoItem.user = user;

      const userCollection: IUser[] = [
        { id: "85723ab5-4980-4d3d-8472-f01160f71351" },
      ];
      jest
        .spyOn(userService, "query")
        .mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [
        ...additionalUsers,
        ...userCollection,
      ];
      jest
        .spyOn(userService, "addUserToCollectionIfMissing")
        .mockReturnValue(expectedCollection);

      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it("Should update editForm", () => {
      const toDoItem: IToDoItem = { id: 456 };
      const user: IUser = { id: "1544041a-5f03-4d79-8de3-a2393e8ada73" };
      toDoItem.user = user;

      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(toDoItem));
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe("save", () => {
    it("Should call update service on save for existing entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ToDoItem>>();
      const toDoItem = { id: 123 };
      jest.spyOn(toDoItemService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: toDoItem }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(toDoItemService.update).toHaveBeenCalledWith(toDoItem);
      expect(comp.isSaving).toEqual(false);
    });

    it("Should call create service on save for new entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ToDoItem>>();
      const toDoItem = new ToDoItem();
      jest.spyOn(toDoItemService, "create").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: toDoItem }));
      saveSubject.complete();

      // THEN
      expect(toDoItemService.create).toHaveBeenCalledWith(toDoItem);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it("Should set isSaving to false on error", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ToDoItem>>();
      const toDoItem = { id: 123 };
      jest.spyOn(toDoItemService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error("This is an error!");

      // THEN
      expect(toDoItemService.update).toHaveBeenCalledWith(toDoItem);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe("Tracking relationships identifiers", () => {
    describe("trackUserById", () => {
      it("Should return tracked User primary key", () => {
        const entity = { id: "ABC" };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
