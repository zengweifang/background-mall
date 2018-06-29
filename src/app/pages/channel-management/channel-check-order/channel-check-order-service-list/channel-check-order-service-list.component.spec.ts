import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelCheckOrderServiceListComponent } from './channel-check-order-service-list.component';

describe('ChannelCheckOrderServiceListComponent', () => {
  let component: ChannelCheckOrderServiceListComponent;
  let fixture: ComponentFixture<ChannelCheckOrderServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelCheckOrderServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelCheckOrderServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
