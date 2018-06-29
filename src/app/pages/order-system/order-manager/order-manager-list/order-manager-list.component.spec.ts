import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderManagerListComponent } from './order-manager-list.component';

describe('OrderManagerListComponent', () => {
  let component: OrderManagerListComponent;
  let fixture: ComponentFixture<OrderManagerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderManagerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderManagerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
