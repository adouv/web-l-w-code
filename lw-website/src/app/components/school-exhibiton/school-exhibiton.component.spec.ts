import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolExhibitonComponent } from './school-exhibiton.component';

describe('SchoolExhibitonComponent', () => {
  let component: SchoolExhibitonComponent;
  let fixture: ComponentFixture<SchoolExhibitonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolExhibitonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolExhibitonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
