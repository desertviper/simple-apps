import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ToDoItemDetailComponent } from './to-do-item-detail.component';

describe('ToDoItem Management Detail Component', () => {
  let comp: ToDoItemDetailComponent;
  let fixture: ComponentFixture<ToDoItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToDoItemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ toDoItem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ToDoItemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ToDoItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load toDoItem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.toDoItem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
