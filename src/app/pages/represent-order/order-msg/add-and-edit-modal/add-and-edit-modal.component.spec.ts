import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAndEditModalComponent } from './add-and-edit-modal.component';

describe('AddAndEditModalComponent', () => {
  let component: AddAndEditModalComponent;
  let fixture: ComponentFixture<AddAndEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAndEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAndEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
