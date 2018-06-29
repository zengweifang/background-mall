import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAttributeListComponent } from './base-attribute-list.component';

describe('BaseComponent', () => {
  let component: BaseAttributeListComponent;
  let fixture: ComponentFixture<BaseAttributeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseAttributeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAttributeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
