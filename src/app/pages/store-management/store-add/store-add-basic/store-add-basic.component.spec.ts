import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAddBasicComponent } from './store-add-basic.component';

describe('StoreAddBasicComponent', () => {
  let component: StoreAddBasicComponent;
  let fixture: ComponentFixture<StoreAddBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreAddBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAddBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
