import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMsgComponent } from './order-msg.component';

describe('OrderMsgComponent', () => {
  let component: OrderMsgComponent;
  let fixture: ComponentFixture<OrderMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
