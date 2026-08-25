import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpperAi } from './opper-ai';

describe('OpperAi', () => {
  let component: OpperAi;
  let fixture: ComponentFixture<OpperAi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpperAi],
    }).compileComponents();

    fixture = TestBed.createComponent(OpperAi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
