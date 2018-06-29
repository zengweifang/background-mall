import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreListModalComponent } from './store-list-modal.component';

describe('StoreListModalComponent', () => {
  let component: StoreListModalComponent;
  let fixture: ComponentFixture<StoreListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreListModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
