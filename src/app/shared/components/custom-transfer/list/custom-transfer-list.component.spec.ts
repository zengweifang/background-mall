import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTransferComponent } from '../custom-transfer.component';

describe('CustomTransferComponent', () => {
  let component: CustomTransferComponent;
  let fixture: ComponentFixture<CustomTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
