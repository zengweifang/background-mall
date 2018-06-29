import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DianpingEditPackageComponent } from './dianping-edit-package.component';

describe('DianpingEditPackageComponent', () => {
  let component: DianpingEditPackageComponent;
  let fixture: ComponentFixture<DianpingEditPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DianpingEditPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DianpingEditPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
