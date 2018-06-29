import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRemarkComponent } from './show-remark.component';

describe('ShowRemarkComponent', () => {
  let component: ShowRemarkComponent;
  let fixture: ComponentFixture<ShowRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
