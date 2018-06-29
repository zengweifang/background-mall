import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DianpingCheckGoodsComponent } from './dianping-check-goods.component';

describe('DianpingCheckGoodsComponent', () => {
  let component: DianpingCheckGoodsComponent;
  let fixture: ComponentFixture<DianpingCheckGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DianpingCheckGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DianpingCheckGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
