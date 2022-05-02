import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";

import { ToDoItemService } from "../service/to-do-item.service";

import { ToDoItemComponent } from "./to-do-item.component";

describe("ToDoItem Management Component", () => {
  let comp: ToDoItemComponent;
  let fixture: ComponentFixture<ToDoItemComponent>;
  let service: ToDoItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ToDoItemComponent],
    })
      .overrideTemplate(ToDoItemComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(ToDoItemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ToDoItemService);

    const headers = new HttpHeaders();
    jest.spyOn(service, "query").mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it("Should call load all on init", () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.toDoItems?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
