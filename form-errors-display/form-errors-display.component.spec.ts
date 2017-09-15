import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormErrorsDisplayComponent } from './form-errors-display.component';

describe('FormErrorsDisplayComponent', () => {
  let component: FormErrorsDisplayComponent;
  let fixture: ComponentFixture<FormErrorsDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormErrorsDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormErrorsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
