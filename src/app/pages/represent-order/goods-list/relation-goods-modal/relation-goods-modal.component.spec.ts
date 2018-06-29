import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationGoodsModalComponent } from './relation-goods-modal.component';

describe('RelationGoodsModalComponent', () => {
  let component: RelationGoodsModalComponent;
  let fixture: ComponentFixture<RelationGoodsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationGoodsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationGoodsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
