import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAddAreaComponent } from './store-add-area.component';

describe('StoreAddAreaComponent', () => {
  let component: StoreAddAreaComponent;
  let fixture: ComponentFixture<StoreAddAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreAddAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAddAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
