import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassFeaturesComponent } from './class-features.component';

describe('ClassFeaturesComponent', () => {
  let component: ClassFeaturesComponent;
  let fixture: ComponentFixture<ClassFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
