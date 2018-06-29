import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GisServiceAreaListComponent } from './gis-service-area-list.component';

describe('GisServiceAreaListComponent', () => {
  let component: GisServiceAreaListComponent;
  let fixture: ComponentFixture<GisServiceAreaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GisServiceAreaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GisServiceAreaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
