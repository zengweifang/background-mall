import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DianpingAddGoodsComponent } from './dianping-add-goods.component';

describe('DianpingAddGoodsComponent', () => {
  let component: DianpingAddGoodsComponent;
  let fixture: ComponentFixture<DianpingAddGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DianpingAddGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DianpingAddGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
