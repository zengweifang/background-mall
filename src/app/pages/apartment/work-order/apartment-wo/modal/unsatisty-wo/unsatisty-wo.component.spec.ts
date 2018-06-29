import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsatistyWoComponent } from './unsatisty-wo.component';

describe('UnsatistyWoComponent', () => {
  let component: UnsatistyWoComponent;
  let fixture: ComponentFixture<UnsatistyWoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsatistyWoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsatistyWoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
