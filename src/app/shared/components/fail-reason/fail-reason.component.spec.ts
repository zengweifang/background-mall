import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailReasonComponent } from './fail-reason.component';

describe('FailReasonComponent', () => {
  let component: FailReasonComponent;
  let fixture: ComponentFixture<FailReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
