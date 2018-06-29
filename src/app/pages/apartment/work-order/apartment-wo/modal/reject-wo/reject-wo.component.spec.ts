import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectWoComponent } from './reject-wo.component';

describe('RejectWoComponent', () => {
  let component: RejectWoComponent;
  let fixture: ComponentFixture<RejectWoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectWoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectWoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
