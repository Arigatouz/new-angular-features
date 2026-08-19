import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder } from './form-builder';

describe('FormBuilder', () => {
  let component: FormBuilder;
  let fixture: ComponentFixture<FormBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(FormBuilder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
