import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelCheckOrderGoodsListComponent } from './channel-check-order-goods-list.component';

describe('ChannelCheckOrderGoodsListComponent', () => {
  let component: ChannelCheckOrderGoodsListComponent;
  let fixture: ComponentFixture<ChannelCheckOrderGoodsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelCheckOrderGoodsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelCheckOrderGoodsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
