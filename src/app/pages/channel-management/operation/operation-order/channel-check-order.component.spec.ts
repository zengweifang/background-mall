import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelCheckOrderComponent } from './channel-check-order.component';

describe('ChannelCheckOrderComponent', () => {
  let component: ChannelCheckOrderComponent;
  let fixture: ComponentFixture<ChannelCheckOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelCheckOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelCheckOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
