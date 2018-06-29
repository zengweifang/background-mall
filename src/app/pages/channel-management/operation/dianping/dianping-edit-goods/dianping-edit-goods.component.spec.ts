import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DianpingEditGoodsComponent } from './dianping-edit-goods.component';

describe('DianpingEditGoodsComponent', () => {
  let component: DianpingEditGoodsComponent;
  let fixture: ComponentFixture<DianpingEditGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DianpingEditGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DianpingEditGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
