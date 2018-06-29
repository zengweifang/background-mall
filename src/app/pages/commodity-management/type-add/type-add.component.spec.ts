import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAddComponent } from './type-add.component';

describe('ManagementComponent', () => {
  let component: TypeAddComponent;
  let fixture: ComponentFixture<TypeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
