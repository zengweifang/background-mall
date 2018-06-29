import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTransferSearchComponent } from './custom-transfer-search.component';

describe('CustomTransferSearchComponent', () => {
  let component: CustomTransferSearchComponent;
  let fixture: ComponentFixture<CustomTransferSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTransferSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTransferSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
