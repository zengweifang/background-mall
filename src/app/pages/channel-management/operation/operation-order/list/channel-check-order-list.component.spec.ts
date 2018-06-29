import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelCheckOrderListComponent } from './channel-check-order-list.component';

describe('ChannelCheckOrderServiceListComponent', () => {
  let component: ChannelCheckOrderListComponent;
  let fixture: ComponentFixture<ChannelCheckOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelCheckOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelCheckOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
