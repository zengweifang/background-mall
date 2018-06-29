import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAddGoodsComponent } from './store-add-goods.component';

describe('StoreAddGoodsComponent', () => {
  let component: StoreAddGoodsComponent;
  let fixture: ComponentFixture<StoreAddGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreAddGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAddGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
